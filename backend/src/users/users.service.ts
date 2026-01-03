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
          qb.where('user.username LIKE :search', {
            search: `%${search}%`,
          }).orWhere('user.email LIKE :search', { search: `%${search}%` })
          .orWhere('profile.displayName LIKE :search', { search: `%${search}%` }); // Search in profile display name
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
  username,
  email,
  password,
  provider,
  providerId,
  emailVerifiedAt,
}: {
  username: string;
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
    username,
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
  username,
  email,
  password,
  provider,
  providerId,
  emailVerifiedAt,
}: {
  user: User;
  username?: string;
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
    ...(username !== undefined && { username }),
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
 async updateEmail(userId: number, email: string): Promise<User> {
    const user = await this.findOneById(userId);
    if (email === user.email) {
      return user; // No change
    }

    const emailExists = await this.repo.exists({
      where: {
        email,
        id: Not(user.id),
      },
    });

    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    user.email = email;
    user.emailVerifiedAt = null; // Email needs re-verification
    return this.repo.save(user);
  }

  async updatePassword(userId: number, currentPassword, newPassword): Promise<User> {
    const user = await this.findOneById(userId);

    if (!user.password) {
      throw new BadRequestException('User does not have a password set.');
    }

    const isPasswordMatching = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Incorrect current password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return this.repo.save(user);
  }

  async updateUsername(
    userId: number,
    newUsername: string,
    currentPassword: string,
  ): Promise<User> {
    const user = await this.findOneById(userId);

    if (!user.password) {
      throw new BadRequestException('Cannot update username for social accounts or accounts without a password.');
    }

    const isPasswordMatching = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Incorrect current password.');
    }

    if (user.username === newUsername) {
      return user; // No change needed
    }

    const usernameExists = await this.repo.exists({
      where: {
        username: newUsername,
        id: Not(user.id),
      },
    });

    if (usernameExists) {
      throw new ConflictException('Username already taken.');
    }

    user.username = newUsername;
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