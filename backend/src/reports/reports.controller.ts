import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { ReportResponseDto } from './dto/report-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @GetUser() user: User,
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Get()
  async findAll(
    @Query() query: ReportQueryDto & { communityId?: number },
    @GetUser() user: User,
  ): Promise<PaginatedResponseDto<ReportResponseDto>> {
    const { data, count } = await this.reportsService.findAll({
      ...query,
      userId: user.id,
    });
    const paginationMeta = new PaginationMetaDto(query.page, query.limit, count, data.length); // Use defaulted values
    return new PaginatedResponseDto(data.map(ReportResponseDto.fromEntity), paginationMeta);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Query('entityType') entityType: 'comment' | 'post' | 'user'): Promise<ResponseDto<ReportResponseDto>> {
    const report = await this.reportsService.findOne(id, entityType);
    return new ResponseDto(ReportResponseDto.fromEntity(report));
  }

  @Patch(':id')
  async updateReportStatus(
    @Param('id') id: number,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    // TODO: Add authorization check for moderators
    return this.reportsService.updateStatus(id, updateReportDto.status, updateReportDto.entityType);
  }
}
