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

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCommunityDto: CreateCommunityDto,
    @GetUser() user: User,
  ): Promise<CommunityResponseDto> {

    const community = await this.communitiesService.create({
       userId :user.id ,
      name: createCommunityDto.name,
      displayName: createCommunityDto.displayName,
      description: createCommunityDto.description,
      isPublic: createCommunityDto.isPublic,
    });
    return CommunityResponseDto.fromEntity(community);
  }

  @Get()
  async findAll(@Query() query: CommunityQueryDto): Promise<[CommunityResponseDto[], number]> {
    const [communities, count] = await this.communitiesService.findAll({
      limit: query.limit,
      page: query.page,
      name: query.name,
      displayName: query.displayName,
      isPublic: query.isPublic,
    });

    return [communities.map(c => CommunityResponseDto.fromEntity(c)), count];
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CommunityResponseDto> {
    const community = await this.communitiesService.findOne(id);
    return CommunityResponseDto.fromEntity(community);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ): Promise<CommunityResponseDto> {
  

    const community = await this.communitiesService.update(  {
      id,
      name: updateCommunityDto.name,
      displayName: updateCommunityDto.displayName,
      description: updateCommunityDto.description,
      isPublic: updateCommunityDto.isPublic,
    });
    return CommunityResponseDto.fromEntity(community);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.communitiesService.remove(id);
  }
}
