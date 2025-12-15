import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentPipe implements PipeTransform<string, Promise<Comment>> {
  constructor(private readonly commentsService: CommentsService) {}

  async transform(value: string): Promise<Comment> {
    const comment = await this.commentsService.findOne(+value);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}
