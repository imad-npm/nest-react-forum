import { Module } from '@nestjs/common';
import { CommunityMembershipRequestsService } from './community-membership-requests.service';
import { CommunityMembershipRequestsController } from './community-membership-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityMembershipRequest } from './entities/community-membership-request.entity';
import { CommunityMembership } from '../community-memberships/entities/community-memberships.entity';
import { User } from '../users/entities/user.entity';
import { Community } from '../communities/entities/community.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommunityMembershipRequest,
      CommunityMembership,
      User,
      Community,
    ]),
  ],
  controllers: [CommunityMembershipRequestsController],
  providers: [CommunityMembershipRequestsService],
})
export class CommunityMembershipRequestsModule {}
