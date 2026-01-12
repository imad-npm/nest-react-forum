import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  InferSubjects,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Reaction } from '../reactions/entities/reaction.entity';
import { Action } from './casl.types';
import { Community } from 'src/communities/entities/community.entity';

export type Subjects =
  | InferSubjects<
    | typeof Post
    | typeof Comment
    | typeof Reaction
    | typeof User
    | typeof Community
  >
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    // ---- Post Permissions ----
  /*  can(Action.Read, Post); // any post
    can(Action.Create, Post);
    can(Action.Update, Post, { authorId: user.id }); // only own
    can(Action.Delete, Post, { authorId: user.id });
*/
    // ---- Comment Permissions ----
  /*  can(Action.Read, Comment);
    can(Action.Create, Comment);
    can(Action.Update, Comment, { authorId: user.id });
    can(Action.Delete, Comment, { authorId: user.id });
*/
    // ---- Reaction Permissions ----
    can(Action.Create, Reaction);
    can(Action.Delete, Reaction, { userId: user.id });
    can(Action.Update, Reaction, { userId: user.id });

    can(Action.Delete, Community, { createdById: user.id });
    can(Action.Update, Community, { createdById: user.id });



    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
