import { IsOptional, IsIn, IsNumber, IsEnum } from 'class-validator';
import { Reportable, ReportStatus } from '../entities/report.entity';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class ReportQueryDto extends PaginationDto {

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(Reportable)
  reportableType?: Reportable;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  reporterId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  communityId?: number;
}
