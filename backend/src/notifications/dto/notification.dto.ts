import { Notification, NotificationResourceType } from '../entities/notification.entity';
import { User } from 'src/users/entities/user.entity';

export class NotificationDto {
  id: number;
  recipientId: number;
  actorId?: number;
  actorUsername?: string;
  type: string;
  read: boolean;
  createdAt: Date;
  resourceType?: NotificationResourceType;
  resourceId?: number;

  static fromEntity(notification: Notification): NotificationDto {
    const dto = new NotificationDto();
    dto.id = notification.id;
    dto.recipientId = notification.recipient.id;
    dto.actorId = notification.actor?.id;
    dto.actorUsername = notification.actor?.username;
    dto.type = notification.type;
    dto.read = notification.read;
    dto.createdAt = notification.createdAt;
    dto.resourceType = notification.resourceType;
    dto.resourceId = notification.resourceId;
    return dto;
  }
}
