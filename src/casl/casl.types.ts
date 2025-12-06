import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Reaction } from '../reactions/entities/reaction.entity';

export type Subjects =
  | typeof User
  | typeof Post
  | typeof Comment
  | typeof Reaction
  | User
  | Post
  | Comment
  | Reaction
  | 'all';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
