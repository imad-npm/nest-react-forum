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
import { CommunitySubscriptionsService } from './community-subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CommunitySubscriptionResponseDto } from './dto/community-subscription-response.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { CommunitySubscription } from './entities/community-subscription.entity';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommunitySubscriptionsController {
  constructor(
    private readonly communitySubscriptionsService: CommunitySubscriptionsService,
  ) { }


  // Unified GET endpoint
  @Get('community-subscriptions')
  async findSubscriptions(
    @GetUser() user: User,
    @Query('user') userQuery?: 'me',
    @Query('communityId') communityId?: string,
  ): Promise<CommunitySubscriptionResponseDto[]> {

    const filters: { userId?: number; communityId?: number } = {};

    if (userQuery === 'me') {
      filters.userId = user.id;
    }

    if (communityId) {
      filters.communityId = parseInt(communityId, 10);
    }

    const subscriptions = await this.communitySubscriptionsService.findSubscriptions(filters);

    return subscriptions.map(CommunitySubscriptionResponseDto.fromEntity);
  }


  @Post('communities/:communityId/subscriptions')
  async subscribe(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ): Promise<CommunitySubscriptionResponseDto> {
    const subscription = await this.communitySubscriptionsService.subscribe(
      communityId,
      user.id,
    );
    return CommunitySubscriptionResponseDto.fromEntity(subscription);
  }

  @Delete('communities/:communityId/subscriptions/me')
 async unsubscribe(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ) {
    await  this.communitySubscriptionsService.unsubscribe(communityId, user.id);
  }



}
