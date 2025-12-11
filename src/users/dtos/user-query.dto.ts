import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UserQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string; // Filter by name or email

  @IsOptional()
  @IsEnum(['google', 'github'])
  provider?: 'google' | 'github';
}
