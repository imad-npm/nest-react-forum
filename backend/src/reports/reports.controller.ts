import { Controller, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto'; // Import UpdateReportDto
import { ReportsService } from './reports.service';

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

  @Patch(':id')
  async updateReportStatus(
    @Param('id') id: number,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    // TODO: Add authorization check for moderators
    return this.reportsService.updateStatus(id, updateReportDto.status, updateReportDto.entityType);
  }
}
