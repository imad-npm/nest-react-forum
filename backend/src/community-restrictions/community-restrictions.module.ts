import { Module } from '@nestjs/common';
import { CommunityRestrictionsService } from './community-restrictions.service';
import { CommunityRestrictionsController } from './community-restrictions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from 'src/communities/entities/community.entity';
import { CommunityMembership } from 'src/community-memberships/entities/community-memberships.entity';
import { User } from 'src/users/entities/user.entity';
import { CommunityRestriction } from './entities/community-restriction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommunityRestriction,
      Community,
      User,
      CommunityMembership,
    ]),
  ],
  controllers: [CommunityRestrictionsController],
  providers: [CommunityRestrictionsService],
  exports: [CommunityRestrictionsService],
})
export class CommunityRestrictionsModule {}
