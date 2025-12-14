import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CommunitySubscriptionsService } from './community-subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CommunitySubscriptionResponseDto } from './dto/community-subscription-response.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { CommunitySubscription } from './entities/community-subscription.entity';

@Controller('community-subscriptions')
@UseGuards(JwtAuthGuard)
export class CommunitySubscriptionsController {
  constructor(
    private readonly communitySubscriptionsService: CommunitySubscriptionsService,
  ) {}

  @Post(':communityId')
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

  @Delete(':communityId')
  unsubscribe(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ) {
    return this.communitySubscriptionsService.unsubscribe(communityId, user.id);
  }

  @Get('user')
  async findUserSubscriptions(@GetUser() user: User): Promise<CommunitySubscriptionResponseDto[]> {
    const subscriptions = await this.communitySubscriptionsService.findUserSubscriptions(user.id);
    return subscriptions.map(subscription => CommunitySubscriptionResponseDto.fromEntity(subscription));
  }

  @Get('community/:communityId')
  async findCommunitySubscribers(
    @Param('communityId', ParseIntPipe) communityId: number,
  ): Promise<CommunitySubscriptionResponseDto[]> {
    const subscriptions = await this.communitySubscriptionsService.findCommunitySubscribers(
      communityId,
    );
    return subscriptions.map(subscription => CommunitySubscriptionResponseDto.fromEntity(subscription));
  }
}
