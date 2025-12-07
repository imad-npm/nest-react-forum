import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class UserPipe implements PipeTransform {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async transform(value: string) {
    const user = await this.repo.findOne({
      where: { id: +value },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
