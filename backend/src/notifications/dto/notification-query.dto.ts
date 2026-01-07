import { IsOptional, IsNumberString, IsBooleanString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class NotificationQueryDto extends PaginationDto {

  @IsOptional()
  @IsBooleanString()
  @Type(() => Boolean)
  read?: boolean;
}
