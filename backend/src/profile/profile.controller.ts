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
  Param, // NEW
  ParseIntPipe, // NEW
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
import { PictureInterceptor } from './interceptors/picture.interceptor';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService

  ) { }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyProfile(@GetUser() user: User): Promise<ProfileResponseDto> {
    const profile = await this.profileService.findOneByUserId(user.id);
    return ProfileResponseDto.fromEntity(profile);
  }

  // New endpoint to get a profile by user ID
  @Get('user/:userId')
  async getProfileByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<ProfileResponseDto> {
    const profile = await this.profileService.findOneByUserId(userId);
    return ProfileResponseDto.fromEntity(profile);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(PictureInterceptor
  )
  async createMyProfile(
    @GetUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileResponseDto> {

    const profile = await this.profileService.createProfile({
      user,
      displayName: createProfileDto.displayName,
      bio: createProfileDto.bio,
      picture: file ? file.path : undefined,
    });

    return ProfileResponseDto.fromEntity(profile);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(PictureInterceptor)
  async updateMyProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.findOneByUserId(user.id);

    const updatedProfile = await this.profileService.updateProfile({
      profile,
      displayName: updateProfileDto.displayName,
      bio: updateProfileDto.bio,
      picture: file ? file.path : undefined,
    });

    return ProfileResponseDto.fromEntity(updatedProfile);
  }
}