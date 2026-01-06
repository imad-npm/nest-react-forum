export class NotificationCreatedEvent {
  constructor(
    public readonly recipient: any,
    public readonly actor: any,
    public readonly type: string,
    public readonly postId: number,
    public readonly commentId: number,
  ) {}
}
