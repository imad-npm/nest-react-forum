import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { User } from 'src/users/entities/user.entity';

interface CreateProfileParams {
  user: User;
  username: string ;
  bio?: string | null;
  picture?: string | null;
}

interface UpdateProfileParams {
  profile: Profile;
  username?: string | null;
  bio?: string | null;
  picture?: string | null;
}

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async createProfile(params: CreateProfileParams): Promise<Profile> {
    const profile = this.profileRepo.create({
      user: params.user,
      username: params.username ?? null,
      bio: params.bio ?? null,
      picture: params.picture ?? null,
    });
    return this.profileRepo.save(profile);
  }

  async updateProfile(params: UpdateProfileParams): Promise<Profile> {
    const { profile, username, bio, picture } = params;
    Object.assign(profile, {
      ...(username !== undefined && { username }),
      ...(bio !== undefined && { bio }),
      ...(picture !== undefined && { picture }),
    });
    return this.profileRepo.save(profile);
  }

  async findOneByUserId(userId: number): Promise<Profile> {
    const profile = await this.profileRepo.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found.`);
    }
    return profile;
  }
}