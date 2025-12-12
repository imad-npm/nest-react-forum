import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserPipe implements PipeTransform<string, Promise<User>> {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: string): Promise<User> {
    return this.usersService.findOneById(+value);
  }
}
