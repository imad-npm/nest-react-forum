import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { Notification, NotificationResourceType } from '../entities/notification.entity';
import { NotificationType } from '../types';

export class NotificationResponseDto {
  id: number;

  recipientId: number;
actorId?: number;
  actor?: UserResponseDto; // 👈 full user DTO

  type: NotificationType;
  read: boolean;
  createdAt: Date;

  resourceType?: NotificationResourceType;
  resourceId?: number;

  static fromEntity(notification: Notification): NotificationResponseDto {
    const dto = new NotificationResponseDto();

    dto.id = notification.id;
    dto.recipientId = notification.recipient.id;

    dto.actor = notification.actor
      ? UserResponseDto.fromEntity(notification.actor)
      : undefined;

    dto.type = notification.type;
    dto.read = notification.read;
    dto.createdAt = notification.createdAt;
    dto.resourceType = notification.resourceType;
    dto.resourceId = notification.resourceId;
dto.actorId = notification.actor?.id;
    return dto;
  }
}
