import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CommunityRestrictionsService } from './community-restrictions.service';
import { CreateCommunityRestrictionDto } from './dto/create-community-restriction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { UpdateCommunityRestrictionDto } from './dto/update-community-restriction.dto';
import { CaslService } from 'src/casl/casl.service';
import { Action } from 'src/casl/casl.types';
import { CommunityRestriction } from './entities/community-restriction.entity';
import { CommunityRestrictionResponseDto } from './dto/community-restriction-response.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { CommunityRestrictionQueryDto } from './dto/community-restriction-query.dto';

@Controller('community-restrictions')
export class CommunityRestrictionsController {
  constructor(
    private readonly communityRestrictionsService: CommunityRestrictionsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCommunityRestrictionDto: CreateCommunityRestrictionDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommunityRestrictionResponseDto>> {
    // TODO: Add CASL check
    const restriction = await this.communityRestrictionsService.create(
      {
        restrictionType: createCommunityRestrictionDto.restrictionType,
        communityId: createCommunityRestrictionDto.communityId,
        userId: createCommunityRestrictionDto.userId,
        expiresAt:createCommunityRestrictionDto.expiresAt ,
        reason:createCommunityRestrictionDto.reason
      },
      user,
    );
    return new ResponseDto(CommunityRestrictionResponseDto.fromEntity(restriction));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: CommunityRestrictionQueryDto,
    @GetUser() user: User,
  ): Promise<PaginatedResponseDto<CommunityRestrictionResponseDto>> {
    const { data, count } = await this.communityRestrictionsService.findAll(query, user);
    console.log(data);
    
    const paginationMeta = new PaginationMetaDto(query.page, query.limit, count, data.length);

    return new PaginatedResponseDto(
      data.map(CommunityRestrictionResponseDto.fromEntity),
      paginationMeta,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommunityRestrictionResponseDto>> {
    const restriction = await this.communityRestrictionsService.findOne(id, user);
    return new ResponseDto(CommunityRestrictionResponseDto.fromEntity(restriction));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommunityRestrictionDto: UpdateCommunityRestrictionDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommunityRestrictionResponseDto>> {
    // TODO: Add CASL check
    const restriction = await this.communityRestrictionsService.update(
      id,
      { restrictionType: updateCommunityRestrictionDto.restrictionType },
      user,
    );
    return new ResponseDto(CommunityRestrictionResponseDto.fromEntity(restriction));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    // TODO: Add CASL check
    await this.communityRestrictionsService.remove(id, user);
    return new ResponseDto(true);
  }
}
