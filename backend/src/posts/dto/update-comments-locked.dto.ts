import { IsBoolean } from 'class-validator';

export class UpdateCommentsLockedDto {
  @IsBoolean()
  commentsLocked: boolean;
}
