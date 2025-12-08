// src/reactions/reactions.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction, ReactionType } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly repo: Repository<Reaction>,
  ) {}

  /**
   * Create a new reaction.
   * Does NOT toggle or update existing ones.
   * If user already reacted → throws ForbiddenException (client should delete first)
   */
  async create({
    dto,
    user,
    postId,
    commentId,
  }: {
    dto: CreateReactionDto;
    user: User;
    postId?: number;
    commentId?: number;
  }): Promise<Reaction> {
    if (!postId && !commentId) {
      throw new NotFoundException('Reaction must target a post or a comment.');
    }

    // Check if user already has a reaction on this target
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

    // Create new reaction
    const reaction = this.repo.create({
      type: dto.type,
      user,
      post: postId ? { id: postId } : null,
      comment: commentId ? { id: commentId } : null,
    });

    return await this.repo.save(reaction);
  }

  /**
   * Find all reactions for a post
   */
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

  /**
   * Find all reactions for a comment
   */
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

  /**
   * Delete a reaction by ID
   * Only called from controller where @CheckAbility(Action.Delete, Reaction) ensures ownership
   */
  async delete(reaction: Reaction): Promise<void> {
  

    await this.repo.remove(reaction);
  }

  /**
   * Optional: Helper to get current user's reaction on a target (useful for frontend)
   */
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