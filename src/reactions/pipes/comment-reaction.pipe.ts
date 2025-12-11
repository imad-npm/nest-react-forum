import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentReaction } from '../entities/comment-reaction.entity';

@Injectable()
export class CommentReactionPipe implements PipeTransform {
  constructor(
    @InjectRepository(CommentReaction)
    private readonly repo: Repository<CommentReaction>,
  ) {}

  async transform(value: string) {
    const reaction = await this.repo.findOne({
      where: { id: +value },
      relations: ['user'],
    });

    if (!reaction) {
      throw new NotFoundException('Comment reaction not found');
    }

    return reaction;
  }
}
