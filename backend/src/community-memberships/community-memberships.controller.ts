import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { CommunityMembershipsService } from './community-memberships.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { CommunityMembershipQueryDto } from './dto/community-memberships-query.dto';
import { CommunityMembershipResponseDto } from './dto/community-memberships-response.dto';

@Controller()
export class CommunityMembershipsController {
  constructor(
    private readonly communityMembershipsService: CommunityMembershipsService,
  ) { }


  // Unified GET endpoint
  @Get('community-memberships')
  async findMemberships(
   @Query() query: CommunityMembershipQueryDto,
  ): Promise<PaginatedResponseDto<CommunityMembershipResponseDto>> {
    

    const { data, count } = await this.communityMembershipsService.findMemberships({
      userId:query.userId,
      communityId:query.communityId ,
      page:query.page ,
      limit : query.limit
    });

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(data.map(CommunityMembershipResponseDto.fromEntity), paginationMeta);
  }

@UseGuards(JwtAuthGuard)
  @Post('communities/:communityId/memberships')
  async subscribe(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommunityMembershipResponseDto>> {
    const membership = await this.communityMembershipsService.subscribe(
     { communityId,
     userId: user.id,}
    );
    return new ResponseDto(CommunityMembershipResponseDto.fromEntity(membership));
  }
  
@UseGuards(JwtAuthGuard)
  @Delete('users/me/communities/:communityId/memberships')
  async unsubscribe(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    await this.communityMembershipsService.unsubscribe(communityId, user.id);
    return new ResponseDto(true);
  }
}

