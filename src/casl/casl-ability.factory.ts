import { AbilityBuilder, createMongoAbility, MongoAbility, InferSubjects, ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Reaction } from '../reactions/entities/reaction.entity';
import { Action } from './casl.types';
import { log } from 'console';



type Subjects = InferSubjects<typeof Post | typeof Comment | typeof Reaction | typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);    // Class-level permissions (any post)
    can(Action.Read, Post);
    can(Action.Create, Post);
    console.log(user);
    
    
    // Instance-level permissions (only user's own posts)
    can(Action.Update, Post, { authorId: user.id } );
    can(Action.Delete, Post, { authorId: user.id } );

    // Class-level permissions (any comment)
    can(Action.Read, Comment);
    can(Action.Create, Comment);
    
    // Instance-level permissions (only user's own comments)
    can(Action.Update, Comment, { authorId: user.id });
    can(Action.Delete, Comment, { authorId: user.id });

    // Reaction
    can(Action.Create, Reaction);
    can(Action.Delete, Reaction, { userId: user.id });

     return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
