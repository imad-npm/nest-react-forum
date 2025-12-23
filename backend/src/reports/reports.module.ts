import { PostsModule } from 'src/posts/posts.module';
import { CommentsModule } from 'src/comments/comments.module';
import { UsersModule } from 'src/users/users.module';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { UserReport } from './entities/user-report.entity';
import { PostReport } from './entities/post-report.entity';
import { CommentReport } from './entities/comment-report.entity';
import { CaslModule } from 'src/casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentReport, PostReport, UserReport]),
    CaslModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

