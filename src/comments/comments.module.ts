import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]),
    PostsModule,    // <-- REQUIRED so PostsService is available
],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
