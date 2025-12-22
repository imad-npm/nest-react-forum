// backend/src/community-moderators/community-moderators.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityModerator } from './entities/community-moderator.entity';
import { CommunityModeratorsService } from './community-moderators.service';
import { CommunityModeratorsController } from './community-moderators.controller';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { CommunitiesModule } from '../communities/communities.module'; // Import CommunitiesModule

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunityModerator]),
    UsersModule, // Add UsersModule
    CommunitiesModule, // Add CommunitiesModule
  ],
  providers: [CommunityModeratorsService],
  controllers: [CommunityModeratorsController],
  exports: [CommunityModeratorsService],
})
export class CommunityModeratorsModule {}
