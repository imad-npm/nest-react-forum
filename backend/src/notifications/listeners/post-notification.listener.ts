import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationsService } from '../notifications.service';
import { PostCreatedEvent } from '../../posts/events/post-created.event';
import { User } from 'src/users/entities/user.entity';

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

    // Notify the community owner if the post is in a community and the author is not the owner
    if (community && community.owner.id !== author.id) {
      const recipient = community.owner;
      const actor = author;

      const notification = this.notificationRepo.create({
        recipient,
        actor,
        type: 'post_created',
        postId: post.id,
        communityId: community.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        recipient.id.toString(),
        savedNotification,
      );
    }
  }
}