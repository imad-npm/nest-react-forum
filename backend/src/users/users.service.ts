// src/users/users.service.ts
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { ProfileService } from '../profile/profile.service'; // Import ProfileService

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
    const query = this.repo.createQueryBuilder('user').leftJoinAndSelect('user.profile', 'profile'); // Eagerly load profile

    if (search) {
      query.where(
        new Brackets((qb) => {
          qb.where('user.name LIKE :search', {
            search: `%${search}%`,
          }).orWhere('user.email LIKE :search', { search: `%${search}%` })
          .orWhere('profile.username LIKE :search', { search: `%${search}%` }); // Search in profile username
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


  private async find(where: any, message: string): Promise<User> {
    const user = await this.repo.findOne({ where, relations: ['profile'] }); // Eagerly load profile
    if (!user) throw new NotFoundException(message);
    return user;
  }


  async findOneById(id: number): Promise<User> {
    return this.find({ id }, `User with ID ${id} not found.`);
  }

  async findByEmail(email: string): Promise<User> {
    return this.find({ email }, `User with email ${email} not found.`);
  }


async createUser({
  name,
  email,
  password,
  provider,
  providerId,
  emailVerifiedAt,
}: {
  name: string;
  email: string;
  password?: string | null;
  provider?: 'google' | 'github' | null;
  providerId?: string | null;
  emailVerifiedAt?: Date | null;
}): Promise<User> {

  const emailExists = await this.repo.exists({ where: { email } });
  if (emailExists) {
    throw new ConflictException('Email already in use');
  }

  if (provider && password) {
    throw new BadRequestException(
      'Password-based accounts cannot have a provider',
    );
  }

  if (provider && !providerId) {
    throw new BadRequestException('providerId is required when provider is set');
  }

  const user = this.repo.create({
    name,
    email,
    provider: provider ?? null,
    providerId: providerId ?? null,
    emailVerifiedAt:
      emailVerifiedAt ?? (password ? null : new Date()),
    password: password
      ? await bcrypt.hash(password, 10)
      : null,
  });

  return this.repo.save(user);
}
 async updateUser({
  user,
  name,
  email,
  password,
  provider,
  providerId,
  emailVerifiedAt,
}: {
  user: User;
  name?: string;
  email?: string;
  password?: string | null;
  provider?: 'google' | 'github' | null;
  providerId?: string | null;
  emailVerifiedAt?: Date | null;
}): Promise<User> {
  
  if (email !== undefined && email !== user.email) {
    const emailExists = await this.repo.exists({
      where: {
        email,
        id: Not(user.id),
      },
    });

    if (emailExists) {
      throw new ConflictException('Email already in use');
    }
  }

  if (provider !== undefined && password !== undefined) {
    throw new BadRequestException(
      'Cannot update provider and password together',
    );
  }

  if (provider !== undefined && provider && !providerId) {
    throw new BadRequestException(
      'providerId is required when provider is set',
    );
  }

  Object.assign(user, {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(provider !== undefined && { provider }),
    ...(providerId !== undefined && { providerId }),
    ...(emailVerifiedAt !== undefined && { emailVerifiedAt }),
  });

  if (password !== undefined) {
    user.password = password
      ? await bcrypt.hash(password, 10)
      : null;
  }

  return this.repo.save(user);
}


  async markEmailAsVerified(id: number): Promise<void> {
    const user = await this.findOneById(id);

    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date();
      await this.repo.save(user);
    }
  }
}