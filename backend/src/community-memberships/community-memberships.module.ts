import { Module } from '@nestjs/common';
import { CommunityMembershipsService } from './community-memberships.service';
import { CommunityMembershipsController } from './community-memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunitiesModule } from '../communities/communities.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { CommunityMembership } from './entities/community-memberships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommunityMembership,User]), 
  CommunitiesModule],
  controllers: [CommunityMembershipsController],
  providers: [CommunityMembershipsService],
  exports: [CommunityMembershipsService],
})
export class CommunityMembershipsModule {}
