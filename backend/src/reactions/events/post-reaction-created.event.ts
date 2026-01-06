import { PostReaction } from '../entities/post-reaction.entity';

export class PostReactionCreatedEvent {
  constructor(public readonly reaction: PostReaction) {}
}
