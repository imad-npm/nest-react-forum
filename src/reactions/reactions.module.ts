import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { CaslModule } from 'src/casl/casl.module';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Module({
  providers: [ReactionsService],
  controllers: [ReactionsController] ,
  imports: [TypeOrmModule.forFeature([Reaction,Post,Comment]),
  CaslModule ,
  
],
})
export class ReactionsModule {}
