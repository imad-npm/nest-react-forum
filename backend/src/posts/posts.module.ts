import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CaslModule } from 'src/casl/casl.module';
import { CommunitiesModule } from 'src/communities/communities.module';
import { CommunitySubscriptionsModule } from 'src/community-subscriptions/community-subscriptions.module';
import { CommunityAccessModule } from 'src/community-access/community-access.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]),
   CaslModule, CommunitiesModule, CommunityAccessModule
      
],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
