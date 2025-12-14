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
import { CommunitySubscriptionQueryDto } from './dto/community-subscription-query.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommunitySubscriptionsController {
  constructor(
    private readonly communitySubscriptionsService: CommunitySubscriptionsService,
  ) { }


  // Unified GET endpoint
  @Get('community-subscriptions')
  async findSubscriptions(
   @Query() query: CommunitySubscriptionQueryDto,
  ): Promise<CommunitySubscriptionResponseDto[]> {
    

    const subscriptions = await this.communitySubscriptionsService.findSubscriptions({
      userId:query.userId,
      communityId:query.communityId ,
      page:query.page ,
      limit : query.limit
    });

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
    await this.communitySubscriptionsService.unsubscribe(communityId, user.id);
  }



}
