import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { CommunityMembership } from 'src/community-memberships/entities/community-memberships.entity';

import { CommunityMembershipRequest } from 'src/community-membership-requests/entities/community-membership-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityMembership, CommunityMembershipRequest])],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}
