import { Module } from '@nestjs/common';
import { CommunityAccessService } from './community-access.service';
import { CommunitySubscriptionsModule } from '../community-subscriptions/community-subscriptions.module';
import { CommunitiesModule } from 'src/communities/communities.module';

@Module({
  imports: [
    CommunitySubscriptionsModule,  // for subscription checks
    CommunitiesModule,   // for community data access
  ],
  providers: [CommunityAccessService],
  exports: [CommunityAccessService], // allow other modules to inject this service
})
export class CommunityAccessModule {}
