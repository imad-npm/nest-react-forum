import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { CommentReport } from './entities/comment-report.entity';
import { PostReport } from './entities/post-report.entity';
import { UserReport } from './entities/user-report.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CaslModule } from 'src/casl/casl.module';
import { CommunityModerator } from 'src/community-moderators/entities/community-moderator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentReport,
      PostReport,
      UserReport,
      Post,
      User,
      Comment,
      CommunityModerator,
    ]),
    CaslModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
