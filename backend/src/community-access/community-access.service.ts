import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { CommunitiesService } from "src/communities/communities.service";
import { Community } from "src/communities/entities/community.entity";
import { CommunityType } from "src/communities/types";
import { CommunitySubscriptionsService } from "src/community-subscriptions/community-subscriptions.service";

@Injectable()
export class CommunityAccessService {
  constructor(
    private readonly subscriptionsService: CommunitySubscriptionsService,
    private readonly communitiesService: CommunitiesService,
  ) {}

  async assertUserCanViewCommunity(userId: number | undefined, communityId: number) {
    const canView = await this.canUserViewCommunity(userId, communityId);
    if (!canView) {
      throw new ForbiddenException('You do not have permission to view this community.');
    }
  }

 
}
