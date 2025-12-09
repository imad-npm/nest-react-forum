// src/reactions/reactions.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction, ReactionType } from './entities/reaction.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly repo: Repository<Reaction>,
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
  ): Promise<Reaction> {
    if (!postId && !commentId) {
      throw new NotFoundException('Reaction must target a post or a comment.');
    }

    // Prevent duplicate reaction
    const existing = await this.repo.findOne({
      where: {
        user: { id: user.id },
        ...(postId ? { post: { id: postId } } : { comment: { id: commentId } }),
      },
    });

    if (existing) {
      throw new ForbiddenException(
        'You already reacted to this content. Remove your existing reaction first.',
      );
    }

    const reaction = this.repo.create({
      type,
      user,
      post: postId ? { id: postId } : null,
      comment: commentId ? { id: commentId } : null,
    });

    return this.repo.save(reaction);
  }

  findByPost(postId: number) {
    return this.repo.find({
      where: { post: { id: postId } },
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
    return this.repo.find({
      where: { comment: { id: commentId } },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
    });
  }

  async delete(reaction: Reaction): Promise<void> {
    await this.repo.remove(reaction);
  }

  async getUserReactionOnTarget(
    userId: number,
    postId?: number,
    commentId?: number,
  ): Promise<Reaction | null> {
    return this.repo.findOne({
      where: {
        user: { id: userId },
        ...(postId ? { post: { id: postId } } : { comment: { id: commentId } }),
      },
    });
  }
}