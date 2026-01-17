import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';
import { CommunityMembershipRole } from '../types';

export class CommunityMembershipQueryDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  communityId?: number;

   @IsOptional()
  @IsEnum(CommunityMembershipRole)
  role?: CommunityMembershipRole;

  

 
}
