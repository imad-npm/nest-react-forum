// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // ---------------------------------------
  // Base find helper (DRY but minimal)
  // ---------------------------------------
  private async find(where: any, message: string): Promise<User> {
    const user = await this.repo.findOne({ where });
    if (!user) throw new NotFoundException(message);
    return user;
  }

  async findOneById(id: number): Promise<User> {
    return this.find({ id }, `User with ID ${id} not found.`);
  }

  async findByEmail(email: string): Promise<User> {
    return this.find({ email }, `User with email ${email} not found.`);
  }

  // ---------------------------------------
  // Create (OWN logic)
  // ---------------------------------------
  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create();

    user.name = dto.name ;
    user.email = dto.email ;

    user.provider = dto.provider ?? null;
    user.providerId = dto.providerId ?? null;

    user.password = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : null;

    user.emailVerifiedAt =
      dto.emailVerifiedAt ??
      (dto.password ? null : new Date());

    return this.repo.save(user);
  }

  
// ---------------------------------------
// Update (Slimmed logic)
// ---------------------------------------
async updateUser(user: User, dto: UpdateUserDto): Promise<User> {
  const { password, ...rest } = dto; // Separate password for hashing

  // 1. Update basic fields dynamically (only if they exist in dto)
  Object.assign(user, rest);
  
  // 2. Handle password hashing separately if it exists
  if (password !== undefined) {
    user.password = password
      ? await bcrypt.hash(password, 10)
      : null;
  }

  // TypeORM's save handles both creation and update, 
  // and only updates fields that have changed.
  return this.repo.save(user);
}

// ---------------------------------------
  // Email verification
  // ---------------------------------------
  async markEmailAsVerified(id: number): Promise<void> {
    const user = await this.findOneById(id);

    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date();
      await this.repo.save(user);
    }
  }
}
