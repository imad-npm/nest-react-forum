import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
  Get,
} from '@nestjs/common';
import { CommunityMembershipRequestsService } from './community-membership-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as CurrentUser } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('community-membership-requests')
export class CommunityMembershipRequestsController {
  constructor(
    private readonly communityMembershipRequestsService: CommunityMembershipRequestsService,
  ) {}

  @Post(':communityId')
  async create(
    @Param('communityId', ParseIntPipe) communityId: number,
    @CurrentUser() user: User,
  ) {
    return this.communityMembershipRequestsService.createMembershipRequest(
      user.id,
      communityId,
    );
  }

  @Post(':requestId/accept')
  async accept(
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser() user: User,
  ) {
    return this.communityMembershipRequestsService.acceptMembershipRequest(
      requestId,
      user.id,
    );
  }

  @Delete(':requestId/reject')
  async reject(
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser() user: User,
  ) {
    return this.communityMembershipRequestsService.rejectMembershipRequest(
      requestId,
      user.id,
    );
  }

  @Get('community/:communityId')
  async getCommunityRequests(
    @Param('communityId', ParseIntPipe) communityId: number,
  ) {
    return this.communityMembershipRequestsService.getCommunityMembershipRequests(
      communityId,
    );
  }
}
