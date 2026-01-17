import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Get,
  Query,
  Body,
  Patch,
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
import { UpdateMembershipRoleDto } from './dto/update-membership-role.dto';



@Controller()
export class CommunityMembershipsController {
  constructor(
    private readonly communityMembershipsService: CommunityMembershipsService,
  ) {}

  // -----------------------------
  // GET memberships (paginated)
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Get('community-memberships')
  async findMemberships(
    @Query() query: CommunityMembershipQueryDto,
  ): Promise<PaginatedResponseDto<CommunityMembershipResponseDto>> {
    const { data, count } = await this.communityMembershipsService.findMemberships({
      userId: query.userId,
      communityId: query.communityId,
      role : query.role ,
      page: query.page,
      limit: query.limit,
    });

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(
      data.map(CommunityMembershipResponseDto.fromEntity),
      paginationMeta,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('communities/:communityId/members/:targetUserId/role')
  async updateRole(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
    @Body() updateRoleDto: UpdateMembershipRoleDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommunityMembershipResponseDto>> {
    const updated = await this.communityMembershipsService.updateRole(
      user.id,
      targetUserId,
      communityId,
      updateRoleDto.role,
    );
    return new ResponseDto(CommunityMembershipResponseDto.fromEntity(updated));
  }

  // -----------------------------
  // DELETE /users/me/communities/:communityId/memberships
  // Self-leave
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Delete('users/me/communities/:communityId/memberships')
  async leaveCommunity(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    await this.communityMembershipsService.leaveCommunity(user.id, communityId);
    return new ResponseDto(true);
  }

  // -----------------------------
  // DELETE /communities/:communityId/members/:targetUserId
  // Moderator removes a member
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Delete('communities/:communityId/members/:targetUserId')
  async removeMember(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    await this.communityMembershipsService.removeMember(user.id, targetUserId, communityId);
    return new ResponseDto(true);
  }
}
