import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostReaction } from '../entities/post-reaction.entity';

@Injectable()
export class PostReactionPipe implements PipeTransform {
  constructor(
    @InjectRepository(PostReaction)
    private readonly repo: Repository<PostReaction>,
  ) {}

  async transform(value: string) {
    const reaction = await this.repo.findOne({
      where: { id: +value },
      relations: ['user'],
    });

    if (!reaction) {
      throw new NotFoundException('Post reaction not found');
    }

    return reaction;
  }
}
