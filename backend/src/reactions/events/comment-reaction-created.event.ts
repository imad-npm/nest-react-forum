import { CommentReaction } from '../entities/comment-reaction.entity';

export class CommentReactionCreatedEvent {
  constructor(public readonly reaction: CommentReaction) {}
}
