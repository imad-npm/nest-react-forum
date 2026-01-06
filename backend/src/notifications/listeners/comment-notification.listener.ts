import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationsService } from '../notifications.service';
import { CommentCreatedEvent } from 'src/comments/events/comment-created.event';
import { User } from 'src/users/entities/user.entity';

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
        type: 'comment',
        postId: post.id,
        commentId: comment.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        post.author.id.toString(),
        savedNotification,
      );
    }

    if (parent && parent.author.id !== author.id) {
      const notification = this.notificationRepo.create({
        recipient: parent.author,
        actor: author,
        type: 'reply',
        postId: post.id,
        commentId: comment.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        parent.author.id.toString(),
        savedNotification,
      );
    }
  }
}
