import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CommunityType } from '../types';

export class CommunityQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsEnum(CommunityType)
  communityType?: CommunityType;

  @IsOptional()
  @IsString()
  sort?: string;
}
