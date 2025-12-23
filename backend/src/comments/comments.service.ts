import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

import { PostsService } from 'src/posts/posts.service';
import { CommunityAccessService } from 'src/community-access/community-access.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly postsService: PostsService, // Inject PostsService
    private readonly accessService: CommunityAccessService,
  ) { }

  async findAll(options: {
    postId?: number;
    authorId?: number;
    search?: string;
    page?: number;
    limit?: number;
    currentUserId?: number;
    parentId?: number;
  }): Promise<{ data: Comment[]; count: number }> {
    const { postId, authorId, search, page = 1, limit = 10, currentUserId, parentId } = options;

    const query = this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.parent', 'parent');

    if (parentId) {
      query.andWhere('comment.parentId = :parentId', { parentId });
    } else if (postId) {
      query.andWhere('comment.parentId IS NULL');
    }

    if (currentUserId) {
      query.leftJoinAndMapOne(
        'comment.userReaction',
        'comment.reactions',
        'userReaction',
        'userReaction.userId = :currentUserId',
      );
      query.setParameter('currentUserId', currentUserId);
    }

    if (search) {
      query.andWhere('comment.content LIKE :search', { search: `%${search}%` });
    }
    if (authorId) {
      query.andWhere('comment.author.id = :authorId', { authorId });
    }
    if (postId) {
      query.andWhere('comment.post.id = :postId', { postId });
    }

    query.orderBy('comment.createdAt', 'DESC');

    const [data, count] = await query.take(limit).skip((page - 1) * limit).getManyAndCount();

    const commentsWithLimitedReplies = await Promise.all(
      data.map(async (comment) => {
        const repliesQuery = this.commentRepo
          .createQueryBuilder('reply')
          .leftJoinAndSelect('reply.author', 'author')
          .where('reply.parentId = :commentId', { commentId: comment.id })
          .orderBy('reply.createdAt', 'ASC')
          .take(2);

        if (currentUserId) {
          repliesQuery.leftJoinAndMapOne(
            'reply.userReaction',
            'reply.reactions',
            'userReaction',
            'userReaction.userId = :currentUserId',
          );
          repliesQuery.setParameter('currentUserId', currentUserId);
        }

        comment.replies = await repliesQuery.getMany();
        return comment;
      }),
    );

    return { data: commentsWithLimitedReplies, count };
  }

  async findOne(id: number, currentUserId?: number) {

    const mainCommentQuery = this.commentRepo.createQueryBuilder('comment')

      .leftJoinAndSelect('comment.author', 'author')

      .leftJoinAndSelect('comment.post', 'post')

      .leftJoinAndSelect('comment.parent', 'parent');

    if (currentUserId) {

      mainCommentQuery.leftJoinAndMapOne(

        'comment.userReaction',

        'comment.reactions',

        'userReaction',

        'userReaction.userId = :currentUserId',

      );

      mainCommentQuery.setParameter('currentUserId', currentUserId);

    }

    mainCommentQuery.where('comment.id = :id', { id });

    const comment = await mainCommentQuery.getOne();

    if (comment) {

      const repliesQuery = this.commentRepo

        .createQueryBuilder('reply')

        .leftJoinAndSelect('reply.author', 'author')

        .where('reply.parentId = :commentId', { commentId: comment.id })

        .orderBy('reply.createdAt', 'ASC')

        .take(2); // Limit to 2 replies

      if (currentUserId) {

        repliesQuery.leftJoinAndMapOne(

          'reply.userReaction',

          'reply.reactions',

          'userReaction',

          'userReaction.userId = :currentUserId',

        );

        repliesQuery.setParameter('currentUserId', currentUserId);

      }

      comment.replies = await repliesQuery.getMany();

    }

    return comment;

  }

  async createComment(
    postId: number,
    content: string,
    userId: number,
    parentId?: number,
  ) {
    // We get the post via postsService.findOne to ensure consistency and proper typeorm relations loading
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.commentsLocked) {
      throw new BadRequestException('Comments are locked for this post.');
    }

    
    const comment = this.commentRepo.create({
      content,
      authorId: userId,
      post: post,
    });

    if (parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: parentId },
        relations: ['post'],
      });
      if (!parent)
        throw new NotFoundException('Parent comment not found');
      if (parent.post.id !== postId) {
        throw new BadRequestException(
          'Parent comment does not belong to this post',
        );
      }
      comment.parent = parent;
      await this.incrementRepliesCount(parentId);
    }

    const savedComment = await this.commentRepo.save(comment);

    // Increment commentsCount on the post using PostsService
    await this.postsService.incrementCommentsCount(post.id);

    return savedComment;
  }

  async update(
    updateCommentData: {
      id: number;
      content?: string;
    },
  ): Promise<Comment> {
    const comment = await this.commentRepo.findOneBy({
      id: updateCommentData.id,
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (updateCommentData.content !== undefined)
      comment.content = updateCommentData.content;

    return this.commentRepo.save(comment);
  }

  async remove(id: number): Promise<boolean> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['post', 'parent'], // Load post and parent relation to update counts
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Decrement commentsCount on the post using PostsService
    if (comment.post) {
      await this.postsService.decrementCommentsCount(comment.post.id);
    }

    // Decrement repliesCount on the parent comment
    if (comment.parent) {
      await this.decrementRepliesCount(comment.parent.id);
    }

    await this.commentRepo.remove(comment);
    return true;
  }

  async incrementLikesCount(commentId: number): Promise<void> {
    await this.commentRepo.increment({ id: commentId }, 'likesCount', 1);
  }

  async decrementLikesCount(commentId: number): Promise<void> {
    await this.commentRepo.decrement({ id: commentId }, 'likesCount', 1);
  }

  async incrementDislikesCount(commentId: number): Promise<void> {
    await this.commentRepo.increment({ id: commentId }, 'dislikesCount', 1);
  }

  async decrementDislikesCount(commentId: number): Promise<void> {
    await this.commentRepo.decrement({ id: commentId }, 'dislikesCount', 1);
  }

  async incrementRepliesCount(commentId: number): Promise<void> {
    await this.commentRepo.increment({ id: commentId }, 'repliesCount', 1);
  }

  async decrementRepliesCount(commentId: number): Promise<void> {
    await this.commentRepo.decrement({ id: commentId }, 'repliesCount', 1);
  }
}
