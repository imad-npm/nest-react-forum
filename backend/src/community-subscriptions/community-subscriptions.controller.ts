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
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';

@Controller()
export class CommunitySubscriptionsController {
  constructor(
    private readonly communitySubscriptionsService: CommunitySubscriptionsService,
  ) { }


  // Unified GET endpoint
  @Get('community-subscriptions')
  async findSubscriptions(
   @Query() query: CommunitySubscriptionQueryDto,
  ): Promise<PaginatedResponseDto<CommunitySubscriptionResponseDto>> {
    

    const { data, count } = await this.communitySubscriptionsService.findSubscriptions({
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

    return new PaginatedResponseDto(data.map(CommunitySubscriptionResponseDto.fromEntity), paginationMeta);
  }

@UseGuards(JwtAuthGuard)
  @Post('communities/:communityId/subscriptions')
  async subscribe(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommunitySubscriptionResponseDto>> {
    const subscription = await this.communitySubscriptionsService.subscribe(
      communityId,
      user.id,
    );
    return new ResponseDto(CommunitySubscriptionResponseDto.fromEntity(subscription));
  }
  
@UseGuards(JwtAuthGuard)
  @Delete('users/me/communities/:communityId/subscriptions')
  async unsubscribe(
    @Param('communityId', ParseIntPipe) communityId: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    await this.communitySubscriptionsService.unsubscribe(communityId, user.id);
    return new ResponseDto(true);
  }
}

