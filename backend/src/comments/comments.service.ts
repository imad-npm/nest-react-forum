import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm'; // Added DataSource
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity'; // Added Post entity

// import { PostsService } from 'src/posts/posts.service'; // Removed PostsService

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    // private readonly postsService: PostsService, // Removed PostsService
    @InjectRepository(Post) // Injected Post repository
    private readonly postRepo: Repository<Post>,
    private dataSource: DataSource, // Injected DataSource
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get the post directly
      const post = await queryRunner.manager.findOne(Post, { where: { id: postId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.commentsLocked) {
        throw new BadRequestException('Comments are locked for this post.');
      }

      
      const comment = queryRunner.manager.create(Comment, {
        content,
        authorId: userId,
        post: post,
      });

      if (parentId) {
        const parent = await queryRunner.manager.findOne(Comment, {
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
        await queryRunner.manager.increment(Comment, { id: parentId }, 'repliesCount', 1); // Increment repliesCount directly
      }

      const savedComment = await queryRunner.manager.save(comment);

      // Increment commentsCount on the post directly
      await queryRunner.manager.increment(Post, { id: postId }, 'commentsCount', 1);

      await queryRunner.commitTransaction();
      return savedComment;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const comment = await queryRunner.manager.findOne(Comment, {
        where: { id },
        relations: ['post', 'parent'], // Load post and parent relation to update counts
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      // Decrement commentsCount on the post directly
      if (comment.post) {
        await queryRunner.manager.decrement(Post, { id: comment.post.id }, 'commentsCount', 1);
      }

      // Decrement repliesCount on the parent comment directly
      if (comment.parent) {
        await queryRunner.manager.decrement(Comment, { id: comment.parent.id }, 'repliesCount', 1);
      }

      await queryRunner.manager.remove(comment);
      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }



}
