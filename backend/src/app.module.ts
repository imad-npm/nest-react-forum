import { EventEmitterModule } from '@nestjs/event-emitter';
import { Notification } from './notifications/entities/notification.entity';
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommunitiesModule } from './communities/communities.module';
import { CommunityMembershipsModule } from './community-memberships/community-memberships.module';

import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { EmailVerificationToken } from './email-verification/entities/email-verification-token.entity';

import { PasswordResetToken } from './reset-password/entities/password-reset-token.entity';
import { Profile } from './profile/entities/profile.entity';
import { ProfileModule } from './profile/profile.module';
import { Community } from './communities/entities/community.entity';
import { CommunityMembership } from './community-memberships/entities/community-memberships.entity';
import { ReportsModule } from './reports/reports.module';
import { CommentReport } from './reports/entities/comment-report.entity';
import { PostReport } from './reports/entities/post-report.entity';
import { UserReport } from './reports/entities/user-report.entity';
import { CommunityMembershipRequest } from './community-membership-requests/entities/community-membership-request.entity';
import { CommunityMembershipRequestsModule } from './community-membership-requests/community-membership-requests.module';
import { EmailChangeToken } from './email-change/entities/email-change-token.entity';
import { EmailChangeModule } from './email-change/email-change.module';
import { CommunityRestriction } from './community-restrictions/entities/community-restriction.entity';
import { CommunityRestrictionsModule } from "./community-restrictions/community-restrictions.module";
import { NotificationsModule } from './notifications/notifications.module';
import { Reaction } from './reactions/entities/reaction.entity';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env globally
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.getOrThrow<'sqlite' | 'mysql'>('DB_TYPE'),
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [
          User,
          Post,
          Comment,
          Reaction,
          EmailVerificationToken,
          PasswordResetToken,
          Profile,
          Community,
          CommunityMembership,
          CommunityMembershipRequest, // NEW ENTITY
          CommentReport,
          PostReport,
          UserReport,
          CommunityRestriction,
          EmailChangeToken,
          Notification,
        ],
        migrations: ['./src/migrations/*.ts'],
        synchronize: false,
      }),
    }),

    UsersModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    AuthModule,
    CaslModule,
    ResetPasswordModule,
    ProfileModule,
    CommunitiesModule,
    CommunityMembershipsModule,
    CommunityMembershipRequestsModule, // NEW MODULE
    ReportsModule,
    CommunityRestrictionsModule,
    EmailChangeModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
