import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../../reactions/entities/reaction.entity';

@Injectable()
export class ReactionPipe implements PipeTransform {
  constructor(
    @InjectRepository(Reaction)
    private readonly repo: Repository<Reaction>,
  ) {}

  async transform(value: string) {
    const reaction = await this.repo.findOne({
      where: { id: +value },
      relations: ['user', 'post', 'comment'],
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    return reaction;
  }
}
