import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CaslModule } from 'src/casl/casl.module';
import { CommunitiesModule } from 'src/communities/communities.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), CaslModule, CommunitiesModule],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
