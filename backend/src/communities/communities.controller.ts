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
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CommunityQueryDto } from './dto/community-query.dto';
import { CommunityResponseDto } from './dto/community-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCommunityDto: CreateCommunityDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommunityResponseDto>> {
    const community = await this.communitiesService.create({
       userId :user.id ,
      name: createCommunityDto.name,
      displayName: createCommunityDto.displayName,
      description: createCommunityDto.description,
      communityType: createCommunityDto.communityType,
    });
    return new ResponseDto(CommunityResponseDto.fromEntity(community));
  }

  @Get()
  async findAll(@Query() query: CommunityQueryDto): Promise<PaginatedResponseDto<CommunityResponseDto>> {
    const [communities, count] = await this.communitiesService.findAll({
      limit: query.limit,
      page: query.page,
      name: query.name,
      displayName: query.displayName,
      communityType: query.communityType,
      sort: query.sort,
    });

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      communities.length,
    );

    return new PaginatedResponseDto(communities.map(c => CommunityResponseDto.fromEntity(c)), paginationMeta);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number ,
  @GetUser() user :User)
  : Promise<ResponseDto<CommunityResponseDto>> {
    const community = await this.communitiesService.findOne(id,user);
   console.log(community);
   
    return new ResponseDto(CommunityResponseDto.fromEntity(community));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ): Promise<ResponseDto<CommunityResponseDto>> {
    const community = await this.communitiesService.update(  {
      id,
      name: updateCommunityDto.name,
      displayName: updateCommunityDto.displayName,
      description: updateCommunityDto.description,
      communityType: updateCommunityDto.communityType,
    });
    return new ResponseDto(CommunityResponseDto.fromEntity(community));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<void>> {
    const success = await this.communitiesService.remove(id);
    return new ResponseDto(success);
  }
}
