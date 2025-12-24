import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm'; // Added DataSource

import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { ReactionType } from './reactions.types';
// import { PostsService } from 'src/posts/posts.service'; // Removed
// import { CommentsService } from 'src/comments/comments.service'; // Removed
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Post } from 'src/posts/entities/post.entity'; // Added Post entity
import { Comment } from 'src/comments/entities/comment.entity'; // Added Comment entity

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(PostReaction)
    private readonly postReactionRepo: Repository<PostReaction>,

    @InjectRepository(CommentReaction)
    private readonly commentReactionRepo: Repository<CommentReaction>,

    // private readonly postsService: PostsService, // Removed
    // private readonly commentsService: CommentsService, // Removed
    @InjectRepository(Post) // Injected Post repository
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment) // Injected Comment repository
    private readonly commentRepo: Repository<Comment>,
    private dataSource: DataSource, // Injected DataSource
  ) { }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create({
    type,
    userId,
    postId,
    commentId,
  }: {
    type: ReactionType;
    userId: number;
    postId?: number;
    commentId?: number;
  }) {
    if (!Object.values(ReactionType).includes(type)) {
      throw new BadRequestException('Invalid reaction type');
    }

    if (!!postId === !!commentId) {
      throw new BadRequestException(
        'Reaction must target either a post or a comment (not both)',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (postId) {
        const post = await queryRunner.manager.findOne(Post, { where: { id: postId } });
        if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);

        const existing = await queryRunner.manager.findOne(PostReaction, {
          where: { userId, postId },
        });
        
        if (existing) {
          throw new ForbiddenException(
            'You already reacted to this post',
          );
        }

        const newReaction = queryRunner.manager.create(PostReaction, { type, userId, postId });
        await queryRunner.manager.save(newReaction);

        if (newReaction.type === ReactionType.LIKE) {
          await queryRunner.manager.increment(Post, { id: postId }, 'likesCount', 1);
        } else {
          await queryRunner.manager.increment(Post, { id: postId }, 'dislikesCount', 1);
        }
        await queryRunner.commitTransaction();
        return newReaction;
      }
      else if (commentId) {
        const comment = await queryRunner.manager.findOne(Comment, { where: { id: commentId } });
        if (!comment) throw new NotFoundException(`Comment with ID ${commentId} not found`);

        const existing = await queryRunner.manager.findOne(CommentReaction, {
          where: { userId, commentId },
        });

        if (existing) {
          throw new ForbiddenException(
            'You already reacted to this comment',
          );
        }

        const newReaction = queryRunner.manager.create(CommentReaction, { type, userId, commentId });
        await queryRunner.manager.save(newReaction);

        if (newReaction.type === ReactionType.LIKE) {
          await queryRunner.manager.increment(Comment, { id: commentId }, 'likesCount', 1);
        } else {
          await queryRunner.manager.increment(Comment, { id: commentId }, 'dislikesCount', 1);
        }
        await queryRunner.commitTransaction();
        return newReaction;
      }
      throw new BadRequestException(
        'Reaction must target either a post or a comment',
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }  async findByPost({
    postId,
    page = 1,
    limit = 10,
  }: {
    postId: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: PostReaction[]; count: number }> {
    const skip = (page - 1) * limit;

    const [data, count] = await this.postReactionRepo.findAndCount({
      where: { postId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
      skip,
      take: limit,
    });

    return { data, count };
  }

  async findByComment({
    commentId,
    page = 1,
    limit = 10,
  }: {
    commentId: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: CommentReaction[]; count: number }> {
    const skip = (page - 1) * limit;

    const [data, count] = await this.commentReactionRepo.findAndCount({
      where: { commentId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
      skip,
      take: limit,
    });

    return { data, count };
  }

  async getUserReactionOnPost(
    userId: number,
    postId: number,
  ) {
    return this.postReactionRepo.findOne({ where: { userId, postId } });
  }

  async findPostReactionById(id: number): Promise<PostReaction> {
    const reaction = await this.postReactionRepo.findOne({ where: { id } });
    if (!reaction) {
      throw new NotFoundException('Post reaction not found');
    }
    return reaction;
  }

  async findCommentReactionById(id: number): Promise<CommentReaction> {
    const reaction = await this.commentReactionRepo.findOne({ where: { id } });
    if (!reaction) {
      throw new NotFoundException('Comment reaction not found');
    }
    return reaction;
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
 async updatePostReaction({
  id,
  type
}: {
  id: number;
  type: ReactionType;
}) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const reaction = await queryRunner.manager.findOne(PostReaction, { where: { id } });
    if (!reaction) throw new NotFoundException('Post reaction not found');
    
    // Return early if no change
    if (reaction.type === type) {
      await queryRunner.commitTransaction();
      return reaction;
    }

    const oldType = reaction.type;
    const newType = type;
    const postId = reaction.postId;

    // Update counters based on change
    if (oldType === ReactionType.LIKE) {
      await queryRunner.manager.decrement(Post, { id: postId }, 'likesCount', 1);
    } else if (oldType === ReactionType.DISLIKE) {
      await queryRunner.manager.decrement(Post, { id: postId }, 'dislikesCount', 1);
    }

    if (newType === ReactionType.LIKE) {
      await queryRunner.manager.increment(Post, { id: postId }, 'likesCount', 1);
    } else if (newType === ReactionType.DISLIKE) {
      await queryRunner.manager.increment(Post, { id: postId }, 'dislikesCount', 1);
    }

    // Update reaction type
    reaction.type = newType;
    await queryRunner.manager.save(reaction);

    await queryRunner.commitTransaction();
    return reaction;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

async updateCommentReaction({
  id,
  type
}: {
  id: number;
  type: ReactionType;
}) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const reaction = await queryRunner.manager.findOne(CommentReaction, { where: { id } });
    if (!reaction) throw new NotFoundException('Comment reaction not found');

    // Return early if no change
    if (reaction.type === type) {
      await queryRunner.commitTransaction();
      return reaction;
    }

    const oldType = reaction.type;
    const newType = type;
    const commentId = reaction.commentId;

    // Update counters based on change
    if (oldType === ReactionType.LIKE) {
      await queryRunner.manager.decrement(Comment, { id: commentId }, 'likesCount', 1);
    } else if (oldType === ReactionType.DISLIKE) {
      await queryRunner.manager.decrement(Comment, { id: commentId }, 'dislikesCount', 1);
    }

    if (newType === ReactionType.LIKE) {
      await queryRunner.manager.increment(Comment, { id: commentId }, 'likesCount', 1);
    } else if (newType === ReactionType.DISLIKE) {
      await queryRunner.manager.increment(Comment, { id: commentId }, 'dislikesCount', 1);
    }

    // Update reaction type
    reaction.type = newType;
    await queryRunner.manager.save(reaction);

    await queryRunner.commitTransaction();
    return reaction;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async deletePostReaction(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reaction = await queryRunner.manager.findOne(PostReaction, { where: { id } });
      if (!reaction) {
        throw new NotFoundException('Post reaction not found');
      }

      const result = await queryRunner.manager.delete(PostReaction, id);
      if (result.affected) {
        // No need to fetch post explicitly, can directly decrement
        if (reaction.type === ReactionType.LIKE) {
          await queryRunner.manager.decrement(Post, { id: reaction.postId }, 'likesCount', 1);
        } else {
          await queryRunner.manager.decrement(Post, { id: reaction.postId }, 'dislikesCount', 1);
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async deleteCommentReaction(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reaction = await queryRunner.manager.findOne(CommentReaction, { where: { id } });
      if (!reaction) {
        throw new NotFoundException('Comment reaction not found');
      }

      const result = await queryRunner.manager.delete(CommentReaction, id);
      if (result.affected) {
        // No need to fetch comment explicitly, can directly decrement
        if (reaction.type === ReactionType.LIKE) {
          await queryRunner.manager.decrement(Comment, { id: reaction.commentId }, 'likesCount', 1);
        } else {
          await queryRunner.manager.decrement(Comment, { id: reaction.commentId }, 'dislikesCount', 1);
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }}
