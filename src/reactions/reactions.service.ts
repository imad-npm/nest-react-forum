import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly repo: Repository<Reaction>,
  ) {}

  create(dto: CreateReactionDto) {
    const reaction = this.repo.create(dto);
    return this.repo.save(reaction);
  }

  findAll() {
    return this.repo.find({ relations: ['post', 'comment'] });
  }

  async findOne(id: number) {
    const reaction = await this.repo.findOne({ where: { id }, relations: ['post', 'comment'] });
    return reaction;
  }

  async update(id: number, dto: UpdateReactionDto) {
    const reaction = await this.findOne(id);
    Object.assign(reaction, dto);
    return this.repo.save(reaction);
  }

  async remove(id: number) {
    const reaction = await this.findOne(id);
    return this.repo.remove(reaction);
  }
}
