import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { User } from 'src/users/entities/user.entity';

interface CreateProfileParams {
  user: User;
  displayName: string;
  bio?: string | null;
  picture?: string | null;
}

interface UpdateProfileParams {
  profile: Profile;
  displayName?: string | null;
  bio?: string | null;
  picture?: string | null; // This will now be the file path
}

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) { }

async createProfile(params: CreateProfileParams): Promise<Profile> {
  try {
    const existingProfile = await this.findOneByUserId(params.user.id).catch(() => null);
    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user.');
    }

    const existingDisplayname = await this.profileRepo.findOne({
      where: { displayName: params.displayName },
    });
    if (existingDisplayname) {
      throw new ConflictException('Username is already taken.');
    }

    const profile = this.profileRepo.create({
      user: params.user,
      displayName: params.displayName ?? null,
      bio: params.bio ?? null,
      picture: params.picture ?? null,
    });

    const savedProfile = await this.profileRepo.save(profile);

    const fullProfile = await this.profileRepo.findOne({
      where: { id: savedProfile.id },
      relations: ['user'],
    });

    if (!fullProfile) {
      throw new NotFoundException('Failed to retrieve the created profile.');
    }

    return fullProfile;
  } catch (err) {
    // Optional: log error here
    throw err;
  }
}

async updateProfile(params: UpdateProfileParams): Promise<Profile> {
  const { profile, displayName, bio, picture } = params;

  if (displayName) {
    const existingDisplayname = await this.profileRepo.findOne({
      where: { displayName, id: Not(profile.id) },
    });
    if (existingDisplayname) {
      throw new ConflictException('Display name is already taken.');
    }
  }

  Object.assign(profile, {
    ...(displayName !== undefined && { displayName }),
    ...(bio !== undefined && { bio }),
    ...(picture !== undefined && { picture }),
  });

  const savedProfile = await this.profileRepo.save(profile);

  const fullProfile = await this.profileRepo.findOne({
    where: { id: savedProfile.id },
    relations: ['user'],
  });

  if (!fullProfile) {
    throw new NotFoundException('Failed to retrieve the updated profile.');
  }

  return fullProfile;
}

  async findOneByUserId(userId: number): Promise<Profile > {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'] // Eager load the user entity
    });
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found.`);
    }
    return profile;
  }
}