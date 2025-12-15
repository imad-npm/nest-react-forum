// src/reactions/reactions.service.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { ReactionType } from './reactions.types';
import { PostsService } from 'src/posts/posts.service';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(PostReaction)
    private readonly postReactionRepo: Repository<PostReaction>,

    @InjectRepository(CommentReaction)
    private readonly commentReactionRepo: Repository<CommentReaction>,

    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
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


    if (postId) {
      await this.postsService.findOne(postId);

      const existing = await this.postReactionRepo.findOne({
        where: { userId, postId },
      });

      if (existing) {
        throw new ForbiddenException(
          'You already reacted to this post',
        );
      }

      return this.postReactionRepo.save(
        this.postReactionRepo.create({ type, userId, postId }),
      );
    }
    else if (commentId) {
      // comment
      await this.commentsService.findOne(commentId);

      const existing = await this.commentReactionRepo.findOne({
        where: { userId, commentId },
      });

      if (existing) {
        throw new ForbiddenException(
          'You already reacted to this comment',
        );
      }

      return this.commentReactionRepo.save(
        this.commentReactionRepo.create({ type, userId, commentId }),
      );
    }
    throw new BadRequestException(
      'Reaction must target either a post or a comment',
    );

  }
async findByPost({
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
  // DELETE
  // ─────────────────────────────────────────────
  async deletePostReaction(id: number) {
    const result = await this.postReactionRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Post reaction not found');
    }
  }

  async deleteCommentReaction(id: number) {
    const result = await this.commentReactionRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Comment reaction not found');
    }
  }
}
