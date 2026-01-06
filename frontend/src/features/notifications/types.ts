export interface INotification {
  id: number;
  recipient: any;
  actor: any;
  type: string;
  postId?: number;
  commentId?: number;
  read: boolean;
  createdAt: string;
}
