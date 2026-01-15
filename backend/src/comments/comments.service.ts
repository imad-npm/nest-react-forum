import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentCreatedEvent } from './events/comment-created.event';
import { User } from 'src/users/entities/user.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    private dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
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
  const {
    postId,
    authorId,
    search,
    page = 1,
    limit = 10,
    currentUserId,
    parentId,
  } = options;

  const qb = this.commentRepo
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.author', 'author')
    .leftJoinAndSelect('comment.post', 'post')
    .leftJoinAndSelect('comment.parent', 'parent');

  // Root comments vs replies
  if (parentId) {
    qb.andWhere('comment.parentId = :parentId', { parentId });
  } else if (postId) {
    qb.andWhere('comment.parentId IS NULL');
  }

  // 🔥 USER REACTION (POLYMORPHIC)
  if (currentUserId) {
    qb.leftJoinAndMapOne(
      'comment.userReaction',
      Reaction,
      'userReaction',
      `
        userReaction.reactableId = comment.id
        AND userReaction.reactableType = :type
        AND userReaction.userId = :currentUserId
      `,
      {
        type: "comment",
        currentUserId,
      },
    );
  }

  if (search) {
    qb.andWhere('comment.content LIKE :search', { search: `%${search}%` });
  }

  if (authorId) {
    qb.andWhere('author.id = :authorId', { authorId });
  }

  if (postId) {
    qb.andWhere('post.id = :postId', { postId });
  }

  qb.orderBy('comment.createdAt', 'DESC');

  const [comments, count] = await qb
    .take(limit)
    .skip((page - 1) * limit)
    .getManyAndCount();

  // ---- LIMITED REPLIES ----
  await Promise.all(
    comments.map(async (comment) => {
      const repliesQb = this.commentRepo
        .createQueryBuilder('reply')
        .leftJoinAndSelect('reply.author', 'author')
        .where('reply.parentId = :commentId', { commentId: comment.id })
        .orderBy('reply.createdAt', 'ASC')
        .take(2);

      if (currentUserId) {
        repliesQb.leftJoinAndMapOne(
          'reply.userReaction',
          Reaction,
          'userReaction',
          `
            userReaction.reactableId = reply.id
            AND userReaction.reactableType = :type
            AND userReaction.userId = :currentUserId
          `,
          {
            type: "comment",
            currentUserId,
          },
        );
      }

      comment.replies = await repliesQb.getMany();
    }),
  );

  return { data: comments, count };
}

 async findOne(id: number, currentUserId?: number) {
  const qb = this.commentRepo
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.author', 'author')
    .leftJoinAndSelect('comment.post', 'post')
    .leftJoinAndSelect('comment.parent', 'parent');

  if (currentUserId) {
    qb.leftJoinAndMapOne(
      'comment.userReaction',
      Reaction,
      'userReaction',
      `
        userReaction.reactableId = comment.id
        AND userReaction.reactableType = :type
        AND userReaction.userId = :currentUserId
      `,
      {
        type: 'comment',
        currentUserId,
      },
    );
  }

  qb.where('comment.id = :id', { id });

  const comment = await qb.getOne();
  if (!comment) return null;

  const repliesQb = this.commentRepo
    .createQueryBuilder('reply')
    .leftJoinAndSelect('reply.author', 'author')
    .where('reply.parentId = :commentId', { commentId: comment.id })
    .orderBy('reply.createdAt', 'ASC')
    .take(2);

  if (currentUserId) {
    repliesQb.leftJoinAndMapOne(
      'reply.userReaction',
      Reaction,
      'userReaction',
      `
        userReaction.reactableId = reply.id
        AND userReaction.reactableType = :type
        AND userReaction.userId = :currentUserId
      `,
      {
        type: 'comment',
        currentUserId,
      },
    );
  }

  comment.replies = await repliesQb.getMany();
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
      const post = await queryRunner.manager.findOne(Post, { where: { id: postId }, relations: ['author'] });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.commentsLocked) {
        throw new BadRequestException('Comments are locked for this post.');
      }

      const author = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!author) {
        throw new NotFoundException('User not found');
      }

      const comment = queryRunner.manager.create(Comment, {
        content,
        author,
        post: post,
      });

      if (parentId) {
        const parent = await queryRunner.manager.findOne(Comment, {
          where: { id: parentId },
          relations: ['post', 'author'],
        });
        if (!parent)
          throw new NotFoundException('Parent comment not found');
        if (parent.post.id !== postId) {
          throw new BadRequestException(
            'Parent comment does not belong to this post',
          );
        }
        comment.parent = parent;
        await queryRunner.manager.increment(Comment, { id: parentId }, 'repliesCount', 1);
      }

      const savedComment = await queryRunner.manager.save(comment);

      await queryRunner.manager.increment(Post, { id: postId }, 'commentsCount', 1);

      await queryRunner.commitTransaction();

      this.eventEmitter.emit('comment.created', new CommentCreatedEvent(savedComment));

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
    }, userId: number
  ): Promise<Comment> {
    const comment = await this.commentRepo.findOneBy({
      id: updateCommentData.id,
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (userId !== comment.authorId) {
      throw new ForbiddenException('You cannot manage this comment.');
    }

    if (updateCommentData.content !== undefined)
      comment.content = updateCommentData.content;

    return this.commentRepo.save(comment);
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const comment = await queryRunner.manager.findOne(Comment, {
        where: { id },
        relations: ['post', 'parent'],
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      if (userId !== comment.authorId) {
        throw new ForbiddenException('You cannot manage this comment.');
      }
      if (comment.post) {
        await queryRunner.manager.decrement(Post, { id: comment.post.id }, 'commentsCount', 1);
      }

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
