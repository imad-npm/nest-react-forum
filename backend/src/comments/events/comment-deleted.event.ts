import { Comment } from '../entities/comment.entity';

export class CommentDeletedEvent {
  constructor(public readonly comment: Comment) {}
}
