import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
  Post,
  ConflictException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfileResponseDto } from './dtos/profile-response.dto';
import { ConfigService } from '@nestjs/config';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService

  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyProfile(@GetUser() user: User): Promise<ProfileResponseDto> {
    const profile = await this.profileService.findOneByUserId(user.id);
    return ProfileResponseDto.fromEntity(profile);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createMyProfile(
    @GetUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileResponseDto> {
  
    const profile = await this.profileService.createProfile({
      user,
      username: createProfileDto.username,
      bio: createProfileDto.bio,
      picture: file ? file.path : undefined,
    });

    return ProfileResponseDto.fromEntity(profile);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateMyProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.findOneByUserId(user.id);

    const updatedProfile = await this.profileService.updateProfile({
      profile,
      username: updateProfileDto.username,
      bio: updateProfileDto.bio,
      picture: file ? file.path : undefined,
    });

    return ProfileResponseDto.fromEntity(updatedProfile);
  }
}
