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

import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { EmailVerificationToken } from './email-verification/entities/email-verification-token.entity';

import { ResetPasswordModule } from './reset-password/reset-password.module';
import { PasswordResetToken } from './reset-password/entities/password-reset-token.entity';
import { CommentReaction } from './reactions/entities/comment-reaction.entity';
import { PostReaction } from './reactions/entities/post-reaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env globally

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'sqlite' | 'mysql'>('DB_TYPE', 'sqlite'),
        database: config.get<string>('DB_NAME', 'forum.db'),
        entities: [
          User,
          Post,
          Comment,
          CommentReaction,
          PostReaction,
          EmailVerificationToken,
          PasswordResetToken,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
