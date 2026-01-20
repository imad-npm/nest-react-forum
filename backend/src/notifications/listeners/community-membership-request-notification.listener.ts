import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationResourceType } from '../entities/notification.entity'; // Import NotificationResourceType
import { NotificationsService } from '../notifications.service';
import { CommunityMembershipRequestCreatedEvent } from '../../community-membership-requests/events/community-membership-request-created.event';
import { User } from 'src/users/entities/user.entity';
import { NotificationType } from '../types'; // NEW: Import NotificationType
import { CommunityMembershipRequest } from 'src/community-membership-requests/entities/community-membership-request.entity';


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

    // Notify the community createdBy
    if (community.createdBy.id !== user.id) {
      const recipient = community.createdBy;
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

  
@OnEvent('community.membership.request.accepted')
async notifyUserOnAccepted(event: {
  request: CommunityMembershipRequest;
}) {
  const { request } = event;

  const user = await this.userRepo.findOneBy({ id: request.userId });
  if (!user) return;

  const notification = this.notificationRepo.create({
    recipient: user,
    type: NotificationType.COMMUNITY_MEMBERSHIP_ACCEPTED,
    resourceType: NotificationResourceType.COMMUNITY,
    resourceId: request.communityId,
  });

  const saved = await this.notificationRepo.save(notification);

  this.notificationsService.sendNotification(
    user.id.toString(),
    saved,
  );
}


  @OnEvent([
  'community.membership.request.accepted',
  'community.membership.request.deleted',
])
async cleanupMembershipRequestNotification(event) {
  const { request } = event;

  await this.notificationRepo.delete({
    resourceType: NotificationResourceType.COMMUNITY_MEMBERSHIP_REQUEST,
    resourceId: request.id,
  });
}

}
