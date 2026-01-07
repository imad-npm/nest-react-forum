export interface INotification {
  id: number;
  recipient: any; // Consider refining this type if User interface is available
  actor: any; // Consider refining this type if User interface is available
  type: string;
  resourceType?: 'Post' | 'Comment' | 'CommunityMembershipRequest'; // Updated to polymorphic
  resourceId?: number; // Updated to polymorphic
  read: boolean;
  createdAt: string;
}
