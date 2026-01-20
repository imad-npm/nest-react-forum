import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationResourceType } from '../entities/notification.entity';
import { NotificationsService } from '../notifications.service';
import { ReactionCreatedEvent } from 'src/reactions/events/reaction-created.event';
import { User } from 'src/users/entities/user.entity';
import { NotificationType } from '../types';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { ReactionDeletedEvent } from 'src/reactions/events/reaction-deleted.event';

@Injectable()
export class ReactionNotificationListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  @OnEvent('reaction.created')
  async handleReactionCreatedEvent(event: ReactionCreatedEvent) {
    const { reaction } = event;
    const { reactableId, reactableType, userId } = reaction;

    let resource: Post | Comment;
    let resourceType: NotificationResourceType;
    let notificationType: NotificationType;

    if (reactableType === 'post') {
      resource = await this.postRepo.findOneOrFail({ where: { id: reactableId }, relations: ['author'] });
      resourceType = NotificationResourceType.POST;
      notificationType = NotificationType.POST_REACTION;
    } else {
      resource = await this.commentRepo.findOneOrFail({ where: { id: reactableId }, relations: ['author'] });
      resourceType = NotificationResourceType.COMMENT;
      notificationType = NotificationType.COMMENT_REACTION;
    }

    if (resource && resource.author.id !== userId) {
      const actor = await this.userRepo.findOneBy({ id: userId });
      if (!actor) return;

      const notification = this.notificationRepo.create({
        recipient: resource.author,
        actor,
        type: notificationType,
        resourceType: resourceType,
        resourceId: resource.id,
        createdAt: new Date(),
      });
      const savedNotification = await this.notificationRepo.save(notification);
      this.notificationsService.sendNotification(
        resource.author.id.toString(),
        savedNotification,
      );
    }
  }

  @OnEvent('reaction.deleted')
async handleReactionDeleted(event: ReactionDeletedEvent) {
  const { reaction } = event;

  await this.notificationRepo.delete({
    actor: { id: reaction.userId },
    resourceId: reaction.reactableId,
    resourceType:
      reaction.reactableType === 'post'
        ? NotificationResourceType.POST
        : NotificationResourceType.COMMENT,
    type:
      reaction.reactableType === 'post'
        ? NotificationType.POST_REACTION
        : NotificationType.COMMENT_REACTION,
  });
}

}
