import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Community } from 'src/communities/entities/community.entity';
import { CommunityMembership } from 'src/community-memberships/entities/community-memberships.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
    [Post, Community, CommunityMembership]),

  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule { }
