import { Module } from '@nestjs/common';
import { CommunitySubscriptionsService } from './community-memberships.service';
import { CommunitySubscriptionsController } from './community-memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunitiesModule } from '../communities/communities.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { CommunityMembership } from './entities/community-memberships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommunityMembership,User]), 
  CommunitiesModule],
  controllers: [CommunitySubscriptionsController],
  providers: [CommunitySubscriptionsService],
  exports: [CommunitySubscriptionsService],
})
export class CommunitySubscriptionsModule {}
