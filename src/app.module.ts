import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from './comments/comments.module';
import { User } from './users/entities/user.entity';
import { Comment } from './comments/entities/comment.entity';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [PostsModule,TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'forum.db',
  entities: [User, Post, Comment],  
      synchronize: false,     })
      , CommentsModule, ReactionsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
