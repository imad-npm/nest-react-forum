import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { ReactionsService } from '../reactions.service';
import { PostReaction } from '../entities/post-reaction.entity';

@Injectable()
export class PostReactionPipe implements PipeTransform<
  string,
  Promise<PostReaction>
> {
  constructor(private readonly reactionsService: ReactionsService) {}

  async transform(value: string): Promise<PostReaction> {
    return this.reactionsService.findPostReactionById(+value);
  }
}
