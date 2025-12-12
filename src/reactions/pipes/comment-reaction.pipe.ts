import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { ReactionsService } from '../reactions.service';
import { CommentReaction } from '../entities/comment-reaction.entity';

@Injectable()
export class CommentReactionPipe implements PipeTransform<
  string,
  Promise<CommentReaction>
> {
  constructor(private readonly reactionsService: ReactionsService) {}

  async transform(value: string): Promise<CommentReaction> {
    return this.reactionsService.findCommentReactionById(+value);
  }
}
