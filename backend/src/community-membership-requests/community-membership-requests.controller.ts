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
import { GetUser } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ResponseDto } from 'src/common/dto/response.dto';

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
  ) {
    return this.requestsService.getCommunityMembershipRequests(communityId);
  }

  /** Create a join request (or auto-join if public) for the logged-in user */
  @Post()
  async createRequest(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ) {
    return this.requestsService.createMembershipRequest(user.id, communityId);
  }

  @Delete()
  async removeRequest(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ) {
    const success=await this.requestsService.removeMembershipRequest(user.id, communityId);
    return new ResponseDto(success);
      }
}
