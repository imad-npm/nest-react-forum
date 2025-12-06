import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Actions, Subjects } from './casl.types';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Reaction } from '../reactions/entities/reaction.entity';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } =
      new AbilityBuilder<AppAbility>(createMongoAbility);

    // POSTS
    can(Actions.Read, Post);
    can(Actions.Create, Post);
    can(Actions.Update, Post, { author: { id: user.id } });
    can(Actions.Delete, Post, { author: { id: user.id } });

    // COMMENTS
    can(Actions.Read, Comment);
    can(Actions.Create, Comment);
    can(Actions.Update, Comment, { author: { id: user.id } });
    can(Actions.Delete, Comment, { author: { id: user.id } });

    // REACTIONS
    can(Actions.Create, Reaction);
    can(Actions.Delete, Reaction, { user: { id: user.id } });
    cannot(Actions.Delete, Reaction, { user: { id: { $ne: user.id } } });

    return build({
      detectSubjectType: item => item.constructor as any,
    });
  }
}
