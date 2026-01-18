import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedPostsController } from './saved-posts.controller';
import { SavedPostsService } from './saved-posts.service';
import { SavedPost } from './entities/saved-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedPost]),
  ],
  controllers: [SavedPostsController],
  providers: [SavedPostsService],
  exports: [SavedPostsService],
})
export class SavedPostsModule {}
