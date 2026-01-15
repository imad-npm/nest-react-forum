import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query, ParseIntPipe } from '@nestjs/common';
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
import { Reportable } from './entities/report.entity';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async createReport(
    @Body() dto: CreateReportDto,
    @GetUser() user: User,
  ) {
    return this.reportsService.create(
      {reportableType: dto.reportableType,
        reportableId: dto.reportableId,
         reason:dto.reason,
         description: dto.description },
      user,
    );  }

  @Get()
  async findAll(
    @Query() query: ReportQueryDto ,
    @GetUser() user: User,
  ): Promise<PaginatedResponseDto<ReportResponseDto>> {
    const { data, count } = await this.reportsService.findAll({
      ...query,
      user:user
    });
    const paginationMeta = new PaginationMetaDto(query.page, query.limit, count, data.length); // Use defaulted values
    return new PaginatedResponseDto(data.map(ReportResponseDto.fromEntity), paginationMeta);
  }

  @Get(':id')
  async findOne(@Param('id') id: number ,
    @GetUser() user: User,
): Promise<ResponseDto<ReportResponseDto>> {
    const report = await this.reportsService.findOne(id,user);
    return new ResponseDto(ReportResponseDto.fromEntity(report));
  }

@Post(':id/resolve')
resolve(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
  return this.reportsService.resolve(id, user);
}

@Post(':id/dismiss')
dismiss(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
  return this.reportsService.dismiss(id, user);
}

}
