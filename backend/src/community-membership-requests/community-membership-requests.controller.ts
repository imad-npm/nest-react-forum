import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { CommunityMembershipRequestsService } from './community-membership-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CommunityMembershipRequestResponseDto } from './dto/community-membership-request-response.dto';
import { CommunityMembershipRequestQueryDto } from './dto/community-membership-request-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';

@UseGuards(JwtAuthGuard)
@Controller('communities/:communityId/membership-requests')
export class CommunityMembershipRequestsController {
  constructor(
    private readonly requestsService: CommunityMembershipRequestsService,
  ) {}

  /** List all pending requests for a community (for admins/mods) */
  @Get()
  async listRequests(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Query() query: CommunityMembershipRequestQueryDto,
  ): Promise<PaginatedResponseDto<CommunityMembershipRequestResponseDto>> {
    const { data, count } = await this.requestsService.findMany({
      ...query,
      communityId,
    });

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(
      data.map(CommunityMembershipRequestResponseDto.fromEntity),
      paginationMeta,
    );
  }

  /** Create a join request (or auto-join if public) for the logged-in user */
  @Post()
  async createRequest(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ) {
    return this.requestsService.createMembershipRequest(user.id, communityId);
  }
  /** Accept a membership request (for moderators) */
  @Post(':userId/accept')
  async acceptRequest(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() actor: User,
  ): Promise<ResponseDto<boolean>> {
    await this.requestsService.acceptMembershipRequest(
      actor.id,
      userId,
      communityId,
    );
    return new ResponseDto(true);
  }


@Delete('me')
removeOwnRequest(
  @Param('communityId', ParseIntPipe) communityId: number,
  @GetUser() user: User,
) {
  return this.requestsService.removeOwnRequest(user.id, communityId);
}

@Delete(':userId')
removeRequest(
  @Param('communityId', ParseIntPipe) communityId: number,
  @Param('userId', ParseIntPipe) userId: number,
  @GetUser() actor: User,
) {
  return this.requestsService.removeMembershipRequest(
    actor.id,
    userId,
    communityId,
  );
}

}
