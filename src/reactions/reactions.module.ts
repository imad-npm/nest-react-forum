import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { CaslModule } from 'src/casl/casl.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  providers: [ReactionsService],
  controllers: [ReactionsController],
  imports: [
    TypeOrmModule.forFeature([PostReaction, CommentReaction]),
    CaslModule,
    PostsModule
  ],
})
export class ReactionsModule {}
