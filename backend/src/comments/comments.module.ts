import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostsModule } from 'src/posts/posts.module';
import { CaslModule } from 'src/casl/casl.module';
import { CommunitiesModule } from 'src/communities/communities.module';
import { CommunitySubscription } from 'src/community-subscriptions/entities/community-subscription.entity';
import { CommunityAccessModule } from 'src/community-access/community-access.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    PostsModule,
    CaslModule,
    CommunitiesModule,
    CommunityAccessModule
    
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
