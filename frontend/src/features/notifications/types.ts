export const NotificationType = {
  NEW_POST: 'NEW_POST',
  NEW_COMMENT: 'NEW_COMMENT',
  POST_REACTION: 'POST_REACTION',
  COMMENT_REACTION: 'COMMENT_REACTION',
  NEW_REPLY_COMMENT: 'NEW_REPLY_COMMENT',
  COMMUNITY_MEMBERSHIP_REQUEST: 'COMMUNITY_MEMBERSHIP_REQUEST',
  COMMUNITY_MEMBERSHIP_ACCEPTED: 'COMMUNITY_MEMBERSHIP_ACCEPTED',
  COMMUNITY_MEMBERSHIP_REJECTED: 'COMMUNITY_MEMBERSHIP_REJECTED',
  // Add other notification types as needed
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface INotificationQueryDto {
  page?: number;
  limit?: number;
  read?: boolean;
}

export interface INotification {
  id: number;
  recipient: any; // Consider refining this type if User interface is available
  actor: any; // Consider refining this type if User interface is available
  type: NotificationType;
  resourceType?: 'Post' | 'Comment' | 'CommunityMembershipRequest' | 'COMMUNITY';
  resourceId?: number;
  read: boolean;
  createdAt: string;
}
export interface NotificationEventPayload {
  action: 'created' | 'deleted';
  notification: INotification;
}

