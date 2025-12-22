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

  async canUserViewCommunity(userId: number | undefined, communityId: number): Promise<boolean> {
    const community = await this.communitiesService.findOne(communityId);
    if (!community) throw new NotFoundException('Community not found');

    switch (community.communityType) {
      case CommunityType.PUBLIC:
      case CommunityType.RESTRICTED:
        return true;
      case CommunityType.PRIVATE:
        if (!userId) return false;
        return this.subscriptionsService.isActiveMember(userId, communityId);
      default:
        return false;
    }
  }

  async canUserContribute(userId: number, communityId: number): Promise<boolean> {
   const community = await this.communitiesService.findOne(communityId);
    if (!community) throw new NotFoundException('Community not found');


    switch (community.communityType) {
      case CommunityType.PUBLIC:
        return true;
      case CommunityType.RESTRICTED:
      case CommunityType.PRIVATE:
        return this.subscriptionsService.isActiveMember(userId, communityId);
      default:
        return false;
    }
  }

  async assertUserCanViewCommunity(userId: number | undefined, communityId: number) {
    const canView = await this.canUserViewCommunity(userId, communityId);
    if (!canView) {
      throw new ForbiddenException('You do not have permission to view this community.');
    }
  }

  async assertUserCanContribute(userId: number, communityId: number) {
    const canContribute = await this.canUserContribute(userId, communityId);
    if (!canContribute) {
      throw new ForbiddenException('You do not have permission to contribute to this community.');
    }
  }
}
