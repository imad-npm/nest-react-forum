import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CaslModule } from 'src/casl/casl.module';
import { Community } from 'src/communities/entities/community.entity';
import { CommunitySubscription } from 'src/community-subscriptions/entities/community-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
    [Post, Community, CommunitySubscription]),
    CaslModule,

  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule { }
