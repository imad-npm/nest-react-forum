import { Controller, Get, Query, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserQueryDto } from './dtos/user-query.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUsernameDto } from './dtos/update-username.dto';
import { User } from './entities/user.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { GetUser } from 'src/decorators/user.decorator';

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

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateUsername(
    @GetUser() user : User,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const updatedUser = await this.usersService.updateUsername(
      user.id,
      updateUsernameDto.username,
      updateUsernameDto.currentPassword,
    );
    return new ResponseDto(UserResponseDto.fromEntity(updatedUser), 'Username updated successfully.');
  }
}
