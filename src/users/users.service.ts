// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dtos/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  /**
   * Fetches a user by ID from the database.
   * Throws NotFoundException if the user does not exist.
   */
  async findOneById(id: number): Promise<User> {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }

  /**
   * Fetches a user by email from the database.
   * Throws NotFoundException if the user does not exist.
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    return user;
  }

    async createUser(dto: RegisterDto, hashedPassword: string): Promise<User> {
    const user = this.repo.create({
      ...dto,
      password: hashedPassword,
    });

    return this.repo.save(user);
  }
}
