import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationsService } from '../notifications.service';
import { PostReactionCreatedEvent } from 'src/reactions/events/post-reaction-created.event';
import { CommentReactionCreatedEvent } from 'src/reactions/events/comment-reaction-created.event';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ReactionNotificationListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @OnEvent('post.reaction.created')
  async handlePostReactionCreatedEvent(event: PostReactionCreatedEvent) {
    const { reaction } = event;
    const { post, userId } = reaction;

    if (post.author.id !== userId) {
      const actor = await this.userRepo.findOneBy({ id: userId });
      if (!actor) return;

      const notification = this.notificationRepo.create({
        recipient: post.author,
        actor,
        type: 'post_reaction',
        postId: post.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        post.author.id.toString(),
        savedNotification,
      );
    }
  }

  @OnEvent('comment.reaction.created')
  async handleCommentReactionCreatedEvent(event: CommentReactionCreatedEvent) {
    const { reaction } = event;
    const { comment, userId } = reaction;

    if (comment.author.id !== userId) {
      const actor = await this.userRepo.findOneBy({ id: userId });
      if (!actor) return;

      const notification = this.notificationRepo.create({
        recipient: comment.author,
        actor,
        type: 'comment_reaction',
        commentId: comment.id,
        postId: comment.post.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        comment.author.id.toString(),
        savedNotification,
      );
    }
  }
}
