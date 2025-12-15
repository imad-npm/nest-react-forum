import { Module } from '@nestjs/common';
import { CommunitySubscriptionsService } from './community-subscriptions.service';
import { CommunitySubscriptionsController } from './community-subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunitySubscription } from './entities/community-subscription.entity';
import { CommunitiesModule } from '../communities/communities.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommunitySubscription]), 
  CommunitiesModule,UsersModule],
  controllers: [CommunitySubscriptionsController],
  providers: [CommunitySubscriptionsService],
  exports: [CommunitySubscriptionsService],
})
export class CommunitySubscriptionsModule {}
