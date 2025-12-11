import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserQueryDto } from './dtos/user-query.dto';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: UserQueryDto) {
    const { data, count } = await this.usersService.findAll(
      query.page,
      query.limit,
      query.search,
      query.provider,
    );

    return {
      data: data.map(UserResponseDto.fromEntity),
      count,
      page: query.page,
      pages: Math.ceil(count / query.limit),
    };
  }
}
