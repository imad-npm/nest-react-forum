import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { CommunitySubscription } from 'src/community-subscriptions/entities/community-subscription.entity';
import { CommunitySubscriptionsModule } from 'src/community-subscriptions/community-subscriptions.module';
import { CommunityAccessModule } from 'src/community-access/community-access.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community]),
CommunitySubscriptionsModule,CommunityAccessModule],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}
