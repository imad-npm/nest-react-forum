import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Post } from './posts/entities/post.entity';
import { User } from './users/entities/user.entity';
import { Comment } from './comments/entities/comment.entity';
import { PostReaction } from './reactions/entities/post-reaction.entity';
import { CommentReaction } from './reactions/entities/comment-reaction.entity';
import { EmailVerificationToken } from './email-verification/entities/email-verification-token.entity';
import { PasswordResetToken } from './reset-password/entities/password-reset-token.entity';
import { Profile } from './profile/entities/profile.entity';
import { Community } from './communities/entities/community.entity'; // Import Community
import { CommunitySubscription } from './community-subscriptions/entities/community-subscription.entity'; // Import CommunitySubscription

config(); // load .env manually

const dbName = process.env.DB_NAME;
if (!dbName) {
  throw new Error('DB_NAME environment variable is not defined.');
}

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbName,
  entities: [
    User,
    Post,
    Comment,
    PostReaction,
    CommentReaction,
    PasswordResetToken,
    EmailVerificationToken,
    Profile,
    Community, // Add Community
    CommunitySubscription, // Add CommunitySubscription
  ],
  synchronize: false,
  migrations: ['src/database/migrations/*.ts'],
  logging: true,
});
