import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationResourceType } from '../entities/notification.entity'; // Import NotificationResourceType
import { NotificationsService } from '../notifications.service';
import { PostCreatedEvent } from '../../posts/events/post-created.event';
import { User } from 'src/users/entities/user.entity';
import { NotificationType } from '../types'; // NEW: Import NotificationType
import { PostDeletedEvent } from 'src/posts/events/post-deleted.event';

@Injectable()
export class PostNotificationListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @OnEvent('post.created')
  async handlePostCreatedEvent(event: PostCreatedEvent) {
    const { post } = event;
    const { community, author } = post;

    // Notify the community createdBy if the post is in a community and the author is not the createdBy
    if (community && community.createdBy.id !== author.id) {
      const recipient = community.createdBy;
      const actor = author;

      const notification = this.notificationRepo.create({
        recipient,
        actor,
        type: NotificationType.NEW_POST, // MODIFIED
        resourceType: NotificationResourceType.POST,
        resourceId: post.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        recipient.id.toString(),
        savedNotification,
      );
    }
  }

  @OnEvent('post.deleted')
async handlePostDeleted(event: PostDeletedEvent) {
  const { post } = event;

  await this.notificationRepo.delete({
    resourceType: NotificationResourceType.POST,
    resourceId: post.id,
  });
}

}