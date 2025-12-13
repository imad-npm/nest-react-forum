import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/update-profile.dto'; // Import UpdateProfileDto
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyProfile(@GetUser() user: User): Promise<any> {
    return this.profileService.findOneByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateMyProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    const profile = await this.profileService.findOneByUserId(user.id);
    return this.profileService.updateProfile({
      profile,
      username: updateProfileDto.username,
      bio: updateProfileDto.bio,
      picture: updateProfileDto.picture,
    });
  }
}

