import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Post } from './posts/entities/post.entity';
import { User } from './users/entities/user.entity';
import { Comment } from './comments/entities/comment.entity';
import { Reaction } from './reactions/entities/reaction.entity';
import { EmailVerificationToken } from './email-verification/entities/email-verification-token.entity';
import { PasswordResetToken } from './reset-password/entities/password-reset-token.entity';
import { Profile } from './profile/entities/profile.entity';
import { Community } from './communities/entities/community.entity'; // Import Community
import { CommunityMembership } from './community-memberships/entities/community-memberships.entity'; // Import CommunityMembership
import { PostReport } from './reports/entities/post-report.entity';
import { CommentReport } from './reports/entities/comment-report.entity';
import { CommunityRestriction } from './community-restrictions/entities/community-restriction.entity';
import { UserReport } from './reports/entities/user-report.entity';

import { CommunityMembershipRequest } from './community-membership-requests/entities/community-membership-request.entity';
import { EmailChangeToken } from './email-change/entities/email-change-token.entity';
import { Notification } from './notifications/entities/notification.entity'; // Import Notification entity

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
    Reaction,
    PasswordResetToken,
    EmailChangeToken,
    EmailVerificationToken,
    Profile,
    Community, // Add Community
    CommunityMembership, // Add CommunityMembership
    CommunityMembershipRequest, // Add CommunityMembershipRequest
    PostReport,
    CommentReport,
    UserReport,
    CommunityRestriction,
    Notification, // Add Notification entity here
  ],
  synchronize: false,
  migrations: ['src/database/migrations/*.ts'],
  logging: true,
});
