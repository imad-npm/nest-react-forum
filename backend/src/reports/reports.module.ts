import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CaslModule } from 'src/casl/casl.module';
import { Report } from './entities/report.entity';
import { CommunityMembership } from 'src/community-memberships/entities/community-memberships.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report ,
      CommunityMembership ,
      Post,
      User,
      Comment,
    ]),
    CaslModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
