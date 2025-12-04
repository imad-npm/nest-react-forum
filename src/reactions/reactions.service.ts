// src/reactions/reactions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly repo: Repository<Reaction>,
  ) { }

  /**
   * Create a reaction using named arguments (PHP-style)
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
// First check if user already reacted to this target
const existing = await this.repo.findOne({
  where: {
    user: { id: user.id },
    ...(postId ? { post: { id: postId } } : { comment: { id: commentId } }),
  },
});

if (existing) {
  if (existing.type === dto.type) {
    // same type → remove (toggle off)
    return await this.repo.remove(existing);
  } else {
    // different type → update
    existing.type = dto.type;
    return this.repo.save(existing);
  }
}

// else create new
    const reaction = this.repo.create({
      type: dto.type,
      user,
      post: postId ? { id: postId } : undefined,
      comment: commentId ? { id: commentId } : undefined,
    });

    return this.repo.save(reaction);
  }

  findByPost(postId: number) {
    return this.repo.find({
      where: { post: { id: postId } },
      relations: ['post', 'comment', 'user'],
    });
  }

  findByComment(commentId: number) {
    return this.repo.find({
      where: { comment: { id: commentId } },
      relations: ['post', 'comment', 'user'],
    });
  }

  async delete(

    reactionId: number): Promise<void> {
    const reaction = await this.repo.findOne({
      where: { id: reactionId },
      relations: ['user', 'post', 'comment'],
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }



    await this.repo.remove(reaction);
  }
}
