// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    provider?: 'google' | 'github',
  ): Promise<{ data: User[]; count: number }> {
    const query = this.repo.createQueryBuilder('user');

    if (search) {
      query.where(
        new Brackets((qb) => {
          qb.where('user.name ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('user.email ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (provider) {
      query.andWhere('user.provider = :provider', { provider });
    }

    query.orderBy('user.createdAt', 'DESC');

    const [data, count] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { data, count };
  }

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
  async createUser(
    name: string,
    email: string,
    password?: string | null,
    provider?: 'google' | 'github' | null,
    providerId?: string | null,
    emailVerifiedAt?: Date | null,
    picture?: string | null,
  ): Promise<User> {
    const user = this.repo.create();

    user.name = name;
    user.email = email;

    user.provider = provider ?? null;
    user.providerId = providerId ?? null;

    user.password = password ? await bcrypt.hash(password, 10) : null;

    user.emailVerifiedAt = emailVerifiedAt ?? (password ? null : new Date());

    return this.repo.save(user);
  }

  // ---------------------------------------
  // Update (Slimmed logic)
  // ---------------------------------------
 
async updateUser({
  user,
  name,
  email,
  password,
  provider,
  providerId,
  emailVerifiedAt,
  picture,
}: {
  user: User;
  name?: string;
  email?: string;
  password?: string | null;
  provider?: 'google' | 'github' | null;
  providerId?: string | null;
  emailVerifiedAt?: Date | null;
  picture?: string | null;
}): Promise<User> {
  // 1. Update basic fields dynamically
  Object.assign(user, {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(provider !== undefined && { provider }),
    ...(providerId !== undefined && { providerId }),
    ...(emailVerifiedAt !== undefined && { emailVerifiedAt }),
    ...(picture !== undefined && { picture }),
  });

  // 2. Handle password hashing separately
  if (password !== undefined) {
    user.password = password ? await bcrypt.hash(password, 10) : null;
  }

  // 3. Save updated user
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
