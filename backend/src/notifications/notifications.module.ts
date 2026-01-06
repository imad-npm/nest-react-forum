import { CommunityMembershipRequestsModule } from 'src/community-membership-requests/community-membership-requests.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CommentNotificationListener } from './listeners/comment-notification.listener';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommentsModule } from 'src/comments/comments.module';
import { ReactionNotificationListener } from './listeners/reaction-notification.listener';
import { ReactionsModule } from 'src/reactions/reactions.module';
import { UsersModule } from 'src/users/users.module';
import { CommunityMembershipRequestNotificationListener } from './listeners/community-membership-request-notification.listener';
import { PostNotificationListener } from './listeners/post-notification.listener';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    EventEmitterModule,
    CommentsModule,
    ReactionsModule,
    UsersModule,
    CommunityMembershipRequestsModule,
    PostsModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    CommentNotificationListener,
    ReactionNotificationListener,
    CommunityMembershipRequestNotificationListener,
    PostNotificationListener,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
