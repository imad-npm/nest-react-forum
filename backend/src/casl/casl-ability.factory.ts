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
import { PostReaction } from '../reactions/entities/post-reaction.entity';
import { CommentReaction } from '../reactions/entities/comment-reaction.entity';
import { Action } from './casl.types';
import { Community } from 'src/communities/entities/community.entity';
import { CommunityMembershipRole } from 'src/community-memberships/types';
import { CommunityType } from 'src/communities/types';

export type Subjects =
  | InferSubjects<
    | typeof Post
    | typeof Comment
    | typeof PostReaction
    | typeof CommentReaction
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
    // PostReaction
  /*  can(Action.Create, PostReaction);
    can(Action.Delete, PostReaction, { userId: user.id });
    can(Action.Update, PostReaction, { userId: user.id });


    // CommentReaction
    can(Action.Create, CommentReaction);
    can(Action.Delete, CommentReaction, { userId: user.id });
    can(Action.Update, CommentReaction, { userId: user.id });
*/
    can(Action.Delete, Community, { createdById: user.id });
    can(Action.Update, Community, { createdById: user.id });



    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
