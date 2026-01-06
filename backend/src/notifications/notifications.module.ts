import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CommentNotificationListener } from './listeners/comment-notification.listener';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    EventEmitterModule,
    CommentsModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, CommentNotificationListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
