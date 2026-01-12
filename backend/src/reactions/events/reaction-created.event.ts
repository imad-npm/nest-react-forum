import { Reaction } from "../entities/reaction.entity";

export class ReactionCreatedEvent {
  constructor(public readonly reaction: Reaction) {}
}
