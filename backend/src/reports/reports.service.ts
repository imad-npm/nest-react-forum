import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { CommentReport } from './entities/comment-report.entity';
import { PostReport } from './entities/post-report.entity';
import { UserReport } from './entities/user-report.entity';
import { ReportStatus } from './entities/base-report.entity';
import { CommentsService } from 'src/comments/comments.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(CommentReport)
    private readonly commentReportRepository: Repository<CommentReport>,
    @InjectRepository(PostReport)
    private readonly postReportRepository: Repository<PostReport>,
    @InjectRepository(UserReport)
    private readonly userReportRepository: Repository<UserReport>,
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createReportDto: CreateReportDto, reporter: User) {
    const { entityType, entityId, reason, description } = createReportDto;

    if (entityType === 'comment') {
      await this.commentsService.findOne(entityId);
      const report = this.commentReportRepository.create({
        reporterId: reporter.id,
        commentId: entityId,
        reason,
        description,
      });
      return this.commentReportRepository.save(report);
    } else if (entityType === 'post') {
      await this.postsService.findOne(entityId);
      const report = this.postReportRepository.create({
        reporterId: reporter.id,
        postId: entityId,
        reason,
        description,
      });
      return this.postReportRepository.save(report);
    } else if (entityType === 'user') {
      await this.usersService.findOneById(entityId);
      const report = this.userReportRepository.create({
        reporterId: reporter.id,
        reportedUserId: entityId,
        reason,
        description,
      });
      return this.userReportRepository.save(report);
    }
  }

  async updateStatus(id: number, status: ReportStatus, entityType: 'comment' | 'post' | 'user') {
    let report: CommentReport | PostReport | UserReport|null;
    let repository: Repository<CommentReport | PostReport | UserReport>;

    switch (entityType) {
      case 'comment':
        repository = this.commentReportRepository;
        break;
      case 'post':
        repository = this.postReportRepository;
        break;
      case 'user':
        repository = this.userReportRepository;
        break;
    }

    report = await repository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} and type ${entityType} not found.`);
    }

    report.status = status;
    return repository.save(report);
  }
}
