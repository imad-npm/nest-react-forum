import { DataSource } from 'typeorm';
import { Post } from './posts/entities/post.entity';
import { User } from './users/entities/user.entity';
import { Comment } from './comments/entities/comment.entity';
import { Reaction } from './reactions/entities/reaction.entity';
import { EmailVerificationToken } from './email-verification/entities/email-verification-token.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'forum.db',
  entities: [User, Post, Comment,Reaction ,EmailVerificationToken],  // <-- include ALL entities  migrations: ['./src/migrations/*.ts'], // <-- migration folder
  synchronize: false,                   // never auto-sync in production

  migrations: ['src/database/migrations/*.ts'],
});
