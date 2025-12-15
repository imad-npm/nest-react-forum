import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationMetaDto } from './pagination-meta.dto';
import { ResponseDto } from './response.dto';

export class PaginatedResponseDto<T> extends ResponseDto<T[]> {
  data: T[];

  @Type(() => PaginationMetaDto)
  @ValidateNested()
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    super(data,undefined, meta);
    this.data = data;
    this.meta = meta;
  }
}
