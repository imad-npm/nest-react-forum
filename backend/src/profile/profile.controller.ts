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
  ParseIntPipe,
  BadRequestException, // NEW
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
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    private configService : ConfigService

  ) { }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyProfile(@GetUser() user: User): Promise<ResponseDto<ProfileResponseDto>> {
    const profile = await this.profileService.findOneByUserId(user.id);
  return new ResponseDto(
    ProfileResponseDto.fromEntity(profile, this.configService.get('APP_DOMAIN'))
  );  }

  // New endpoint to get a profile by user ID
  @Get('user/:userId')
  async getProfileByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<ResponseDto<ProfileResponseDto>> {
    const profile = await this.profileService.findOneByUserId(userId);
    return new ResponseDto(ProfileResponseDto.fromEntity(profile));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(PictureInterceptor
  )
  async createMyProfile(
    @GetUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<ProfileResponseDto>> {

    const profile = await this.profileService.createProfile({
      user,
      displayName: createProfileDto.displayName,
      bio: createProfileDto.bio,
      picture: file ? file.path : undefined,
    });

    return new ResponseDto(ProfileResponseDto.fromEntity(profile));
  }


  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateMyProfile(
    @GetUser() user: User,
    @Body() dto: UpdateProfileDto,
  ): Promise<ResponseDto<ProfileResponseDto>> {
    const profile = await this.profileService.findOneByUserId(user.id);

    const updated = await this.profileService.updateProfile({
      profile,
      displayName: dto.displayName,
      bio: dto.bio,
    });

    return new ResponseDto(ProfileResponseDto.fromEntity(updated));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('picture')
  @UseInterceptors(PictureInterceptor())
  async updateMyProfilePicture(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<ProfileResponseDto>> {
    const profile = await this.profileService.findOneByUserId(user.id);
    console.log('--- updateMyProfilePicture called ---');
    console.log('file:', file);
    // if you want to inspect headers:
    // console.log('req headers content-type:', (req as any).headers?.['content-type']);
    if (!file) {
      throw new BadRequestException('No file uploaded or file rejected by filter');
    }
    const updated = await this.profileService.updateProfile({
      profile,
      picture: file.path,
    });

    return new ResponseDto(ProfileResponseDto.fromEntity(updated));
  }

}