import { Reaction } from "../entities/reaction.entity";

export class ReactionDeletedEvent {
  constructor(public readonly reaction: Reaction) {}
}
