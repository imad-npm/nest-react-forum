import { Comment } from '../entities/comment.entity';

export class CommentCreatedEvent {
  constructor(public readonly comment: Comment) {}
}
