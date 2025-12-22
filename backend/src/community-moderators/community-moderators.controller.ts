import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommunityModeratorsService } from './community-moderators.service';
import { CommunityModeratorResponseDto } from './dto/community-moderator-response.dto';
import { CommunityModeratorQueryDto } from './dto/community-moderator-query.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('communities/:communityId/moderators')
export class CommunityModeratorsController {
  constructor(private readonly service: CommunityModeratorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @GetUser() currentUser: User,
  ): Promise<ResponseDto<CommunityModeratorResponseDto>> {
    const communityModerator = await this.service.create({
      userId,
      communityId,
      currentUser,
    });
    return new ResponseDto(
      CommunityModeratorResponseDto.fromEntity(communityModerator),
    );
  }

  @Get()
  async findAll(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Query() queryDto: CommunityModeratorQueryDto,
  ): Promise<PaginatedResponseDto<CommunityModeratorResponseDto>> {
    const { data, count } = await this.service.findAll({
      communityId,
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const paginationMeta = new PaginationMetaDto(
      queryDto.page,
      queryDto.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(
      data.map(CommunityModeratorResponseDto.fromEntity),
      paginationMeta,
    );
  }

  @Get(':moderatorId')
  async findOne(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Param('moderatorId', ParseIntPipe) moderatorId: number,
  ): Promise<ResponseDto<CommunityModeratorResponseDto>> {
    const communityModerator = await this.service.findOne({
      moderatorId,
      communityId,
    });
    return new ResponseDto(
      CommunityModeratorResponseDto.fromEntity(communityModerator),
    );
  }

  @Delete(':moderatorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Param('moderatorId', ParseIntPipe) moderatorId: number,
    @GetUser() currentUser: User,
  ): Promise<void> {
    await this.service.remove({ moderatorId, communityId, currentUser });
  }
}
