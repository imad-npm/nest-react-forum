import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserQueryDto } from './dtos/user-query.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: UserQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { data, count } = await this.usersService.findAll(
      query.page,
      query.limit,
      query.search,
      query.provider,
    );

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(data.map(UserResponseDto.fromEntity), paginationMeta);
  }
}
