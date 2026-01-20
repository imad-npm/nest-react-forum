import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationResourceType } from '../entities/notification.entity';
import { NotificationsService } from '../notifications.service';
import { CommentCreatedEvent } from 'src/comments/events/comment-created.event';
import { User } from 'src/users/entities/user.entity';
import { NotificationType } from '../types'; // NEW: Import NotificationType
import { CommentDeletedEvent } from 'src/comments/events/comment-deleted.event';

@Injectable()
export class CommentNotificationListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationsService: NotificationsService,
  ) {}

  @OnEvent('comment.created')
  async handleCommentCreatedEvent(event: CommentCreatedEvent) {
    const { comment } = event;
    const { post, author, parent } = comment;

    if (post.author.id !== author.id) {
      const notification = this.notificationRepo.create({
        recipient: post.author,
        actor: author,
        type: NotificationType.NEW_COMMENT, // MODIFIED
        resourceType: NotificationResourceType.COMMENT,
        resourceId: comment.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        post.author.id.toString(),
         {action:"created" ,
          notification : savedNotification
        }
      );
    }

    if (parent && parent.author.id !== author.id) {
      const notification = this.notificationRepo.create({
        recipient: parent.author,
        actor: author,
        type: NotificationType.NEW_REPLY_COMMENT, // MODIFIED
        resourceType: NotificationResourceType.COMMENT,
        resourceId: comment.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        parent.author.id.toString(),
         {action:"created" ,
          notification : savedNotification
        }
      );
    }
  }

    @OnEvent('comment.deleted')
  async handleCommentDeleted(event: CommentDeletedEvent) {
    const { comment } = event;

    const notifications = await this.notificationRepo.find({
      where: {
        resourceType: NotificationResourceType.COMMENT,
        resourceId: comment.id,
      },
      relations: ['recipient'],
    });

    const ids :number[] = [];
    for (const notif of notifications) {
      if (notif.recipient && notif.recipient.id) {
        this.notificationsService.sendNotification(notif.recipient.id.toString(), {
          action: 'deleted',
          notification: notif,
        });
      }
      ids.push(notif.id);
    }

    if (ids.length) {
      await this.notificationRepo.delete(ids);
    }
  }

}

