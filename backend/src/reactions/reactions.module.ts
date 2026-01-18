import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsModule } from 'src/comments/comments.module';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Module({
  providers: [ReactionsService],
  controllers: [ReactionsController],
  imports: [
    TypeOrmModule.forFeature([Reaction, Post, Comment]),
    PostsModule,
    CommentsModule,
  ],
  exports: [ReactionsService],
})
export class ReactionsModule {}
