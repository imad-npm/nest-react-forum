import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly postsService: PostsService, // Inject PostsService
  ) { }

async findAll(options: {
  postId?: number;
  authorId?: number;
  search?: string;
  page?: number;
  limit?: number;
  currentUserId?: number;
}): Promise<{ data: Comment[]; count: number }> {
  const { postId, authorId, search, page = 1, limit = 10, currentUserId } = options;

  const query = this.commentRepo
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.author', 'author')
    .leftJoinAndSelect('comment.post', 'post')
    .leftJoinAndSelect('comment.parent', 'parent');

    
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
    query.andWhere('comment.content ILIKE :search', { search: `%${search}%` });
  }
  if (authorId) {
    query.andWhere('comment.author.id = :authorId', { authorId });
  }
  if (postId) {
    query.andWhere('comment.post.id = :postId', { postId });
  }

  query.orderBy('comment.createdAt', 'DESC');

  const [data, count] = await query.take(limit).skip((page - 1) * limit).getManyAndCount();

  return { data, count };
}


  findOne(id: number, currentUserId?: number) {
    const query = this.commentRepo.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.parent', 'parent');

    if (currentUserId) {
      query.leftJoinAndMapOne(
        'comment.userReaction',
        'comment.reactions',
        'userReaction',
        'userReaction.userId = :currentUserId',
      );
      query.setParameter('currentUserId', currentUserId);
    }

    query.where('comment.id = :id', { id });

    return query.getOne();
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
      relations: ['post'], // Load post relation to update commentsCount
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Decrement commentsCount on the post using PostsService
    if (comment.post) {
      await this.postsService.decrementCommentsCount(comment.post.id);
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
}
