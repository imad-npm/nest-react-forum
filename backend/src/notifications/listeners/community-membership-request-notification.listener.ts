import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationResourceType } from '../entities/notification.entity'; // Import NotificationResourceType
import { NotificationsService } from '../notifications.service';
import { CommunityMembershipRequestCreatedEvent } from '../../community-membership-requests/events/community-membership-request-created.event';
import { User } from 'src/users/entities/user.entity';
import { NotificationType } from '../types'; // NEW: Import NotificationType

@Injectable()
export class CommunityMembershipRequestNotificationListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @OnEvent('community.membership.request.created')
  async handleCommunityMembershipRequestCreatedEvent(
    event: CommunityMembershipRequestCreatedEvent,
  ) {
    const { request } = event;
    const { community, user } = request;

    // Notify the community owner
    if (community.owner.id !== user.id) {
      const recipient = community.owner;
      const actor = user;

      const notification = this.notificationRepo.create({
        recipient,
        actor,
        type: NotificationType.COMMUNITY_MEMBERSHIP_REQUEST, // MODIFIED
        resourceType: NotificationResourceType.COMMUNITY_MEMBERSHIP_REQUEST,
        resourceId: community.id,
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
