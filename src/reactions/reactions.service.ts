// src/reactions/reactions.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { User } from '../users/entities/user.entity';
import { ReactionType } from './reactions.types';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(PostReaction)
    private readonly postReactionRepo: Repository<PostReaction>,
    @InjectRepository(CommentReaction)
    private readonly commentReactionRepo: Repository<CommentReaction>,
  ) {}

  /**
   * Create a new reaction (like/dislike) on post or comment
   * One reaction per user per target allowed
   */
  async create(
    type: ReactionType,
    user: User,
    postId?: number,
    commentId?: number,
  ): Promise<PostReaction | CommentReaction> {
    if (postId) {
      return this.createPostReaction(type, user, postId);
    } else if (commentId) {
      return this.createCommentReaction(type, user, commentId);
    } else {
      throw new NotFoundException('Reaction must target a post or a comment.');
    }
  }

  private async createPostReaction(
    type: ReactionType,
    user: User,
    postId: number,
  ): Promise<PostReaction> {
    const existing = await this.postReactionRepo.findOne({
      where: {
        userId: user.id,
        postId: postId,
      },
    });

    if (existing) {
      throw new ForbiddenException(
        'You already reacted to this content. Remove your existing reaction first.',
      );
    }

    const reaction = this.postReactionRepo.create({
      type,
      user,
      postId,
    });

    return this.postReactionRepo.save(reaction);
  }

  private async createCommentReaction(
    type: ReactionType,
    user: User,
    commentId: number,
  ): Promise<CommentReaction> {
    const existing = await this.commentReactionRepo.findOne({
      where: {
        userId: user.id,
        commentId: commentId,
      },
    });

    if (existing) {
      throw new ForbiddenException(
        'You already reacted to this content. Remove your existing reaction first.',
      );
    }

    const reaction = this.commentReactionRepo.create({
      type,
      user,
      commentId,
    });

    return this.commentReactionRepo.save(reaction);
  }

  findByPost(postId: number) {
    return this.postReactionRepo.find({
      where: { postId: postId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
    });
  }

  findByComment(commentId: number) {
    return this.commentReactionRepo.find({
      where: { commentId: commentId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
    });
  }

  async deletePostReaction(id: number): Promise<void> {
    await this.postReactionRepo.delete(id);
  }

  async deleteCommentReaction(id: number): Promise<void> {
    await this.commentReactionRepo.delete(id);
  }

  async getUserReactionOnPost(
    userId: number,
    postId: number,
  ): Promise<PostReaction | null> {
    return this.postReactionRepo.findOne({
      where: {
        userId,
        postId,
      },
    });
  }

  async findPostReactionById(id: number): Promise<PostReaction> {
    const reaction = await this.postReactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!reaction) {
      throw new NotFoundException('Post reaction not found');
    }
    return reaction;
  }

  async findCommentReactionById(id: number): Promise<CommentReaction> {
    const reaction = await this.commentReactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!reaction) {
      throw new NotFoundException('Comment reaction not found');
    }
    return reaction;
  }
}
