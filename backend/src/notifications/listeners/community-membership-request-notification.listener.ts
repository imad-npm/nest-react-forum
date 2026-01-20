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
import { CommunityMembershipRequestDeletedEvent } from 'src/community-membership-requests/events/community-membership-request-deleted.event';
import { Community } from 'src/communities/entities/community.entity';



@Injectable()
export class CommunityMembershipRequestNotificationListener {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
  ) {}

  /* =========================
     REQUEST CREATED
  ========================== */
  @OnEvent('community.membership.request.created')
  async handleCreated(event: CommunityMembershipRequestCreatedEvent) {
    const { request } = event;

    const community = await this.communityRepo.findOne({
      where: { id: request.communityId },
      relations: ['createdBy'],
    });

    if (!community || !community.createdBy) return;
    if (community.createdBy.id === request.userId) return;

    const notification = this.notificationRepo.create({
      recipient: { id: community.createdBy.id },
      actor: { id: request.userId },
      type: NotificationType.COMMUNITY_MEMBERSHIP_REQUEST,
      resourceType: NotificationResourceType.COMMUNITY_MEMBERSHIP_REQUEST,
      resourceId: request.id,
    });

    const saved = await this.notificationRepo.save(notification);

    this.notificationsService.sendNotification(
      community.createdBy.id.toString(),
      {
        action: 'created',
        notification: saved,
      },
    );
  }

  /* =========================
     REQUEST ACCEPTED → notify user
  ========================== */
  @OnEvent('community.membership.request.accepted')
  async notifyUserAccepted(event: {
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

    this.notificationsService.sendNotification(user.id.toString(), {
      action: 'created',
      notification: saved,
    });
  }

  /* =========================
     REQUEST ACCEPTED → cleanup
  ========================== */
  @OnEvent('community.membership.request.accepted')
  async cleanupOnAccepted(
    event: CommunityMembershipRequestDeletedEvent,
  ) {
    await this.cleanupRequestNotifications(event);
  }

  /* =========================
     REQUEST DELETED → cleanup
  ========================== */
  @OnEvent('community.membership.request.deleted')
  async cleanupOnDeleted(
    event: CommunityMembershipRequestDeletedEvent,
  ) {
    await this.cleanupRequestNotifications(event);
  }

  /* =========================
     SHARED CLEANUP LOGIC
  ========================== */
  private async cleanupRequestNotifications(
    event: CommunityMembershipRequestDeletedEvent,
  ) {
    const { request } = event;

    

    const notifications = await this.notificationRepo.find({
      where: {
        resourceType: NotificationResourceType.COMMUNITY_MEMBERSHIP_REQUEST,
        resourceId: request.id,
      },
      relations: ['recipient'],
    });

    for (const notif of notifications) {
      this.notificationsService.sendNotification(
        notif.recipient.id.toString(),
        {
          action: 'deleted',
          notification: notif,
        },
      );
    }

    await this.notificationRepo.delete({
      resourceType: NotificationResourceType.COMMUNITY_MEMBERSHIP_REQUEST,
      resourceId: request.id,
    });
  }
}

