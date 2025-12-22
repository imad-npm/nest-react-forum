import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunitySubscription } from './entities/community-subscription.entity';
import { User } from '../users/entities/user.entity';
import { CommunitiesService } from '../communities/communities.service';
import { UsersService } from 'src/users/users.service';
import { CommunityType } from 'src/communities/types';
import { CommunitySubscriptionStatus } from './types';

interface SubscriptionQuery {
  userId?: number;
  communityId?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class CommunitySubscriptionsService {
  constructor(
    @InjectRepository(CommunitySubscription)
    private readonly subscriptionsRepository: Repository<CommunitySubscription>,
    private readonly communitiesService: CommunitiesService,
    private readonly usersService: UsersService,
  ) { }


  async findSubscriptions(query: SubscriptionQuery): Promise<{ data: CommunitySubscription[]; count: number }> {
    const where: any = {};
    const relations: string[] = [];

    if (query.userId) {
      where.userId = query.userId;
      relations.push('community');
    }

    if (query.communityId) {
      where.communityId = query.communityId;
      relations.push('user');
    }

    const options: any = { where, relations };

    // Pagination
    if (query.page !== undefined && query.limit !== undefined) {
      const page = Math.max(1, query.page);
      const limit = Math.max(1, query.limit);
      options.skip = (page - 1) * limit;
      options.take = limit;
    }

    const [data, count] = await this.subscriptionsRepository.findAndCount(options);
    return { data, count };
  }

  async findOne(userId: number, communityId: number): Promise<CommunitySubscription | null> {
    return this.subscriptionsRepository.findOne({
      where: { userId, communityId },
    });
  }

  async subscribe(input: {
    userId: number;
    communityId: number;
    activate?: boolean;
  }) {
    const { userId, communityId, activate } = input;

    // Check community existence
    const community = await this.communitiesService.findOne(communityId);
    if (!community) {
      throw new NotFoundException(`Community ${communityId} not found`);
    }

    // Check user existence via UsersService
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const existingSubscription = await this.subscriptionsRepository.findOne({
      where: {
        userId: userId,
        communityId: community.id,
      },
    });

    if (existingSubscription) {
      if (existingSubscription.status === CommunitySubscriptionStatus.BLOCKED) {
        throw new ConflictException(
          `User ${userId} is blocked from community ${community.id}`,
        );
      }
      throw new ConflictException(
        `User ${userId} is already subscribed to community ${community.id}`,
      );
    }

    const communityType = community.communityType;
    let subscriptionStatus: CommunitySubscriptionStatus;

    if (activate) {
      subscriptionStatus = CommunitySubscriptionStatus.ACTIVE;
    } else if (communityType === CommunityType.PUBLIC) {
      subscriptionStatus = CommunitySubscriptionStatus.ACTIVE;
    } else {
      subscriptionStatus = CommunitySubscriptionStatus.PENDING;
    }

    const subscription = this.subscriptionsRepository.create({
      userId: userId,
      communityId: community.id,
      status: subscriptionStatus,
    });

    const savedSubscription = await this.subscriptionsRepository.save(
      subscription,
    );

    await this.communitiesService.update({
      id: community.id,
      subscribersCount: community.subscribersCount + 1,
    });

    return savedSubscription;
  }

  async unsubscribe(communityId: number, userId: number) {

    // Check community existence
    const community = await this.communitiesService.findOne(communityId);
    if (!community) throw new NotFoundException(`Community ${communityId} not found`);

    // Check user existence via UsersService
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);


    const existingSubscription = await this.subscriptionsRepository.findOne({
      where: {
        userId: userId,
        communityId: community.id,
      },
    });

    if (!existingSubscription) {
      throw new NotFoundException(
        `User ${userId} is not subscribed to community ${community.id}`,
      );
    }

    await this.subscriptionsRepository.remove(existingSubscription);

    await this.communitiesService.update({
      id: community.id,
      subscribersCount: community.subscribersCount - 1,
    });

    return { message: 'Unsubscribed successfully' };
  }

  // --- New methods for subscription status checks ---
  async getSubscriptionStatus(userId: number, communityId: number): Promise<CommunitySubscriptionStatus | null> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { userId, communityId },
      select: ['status'],
    });
    return subscription ? subscription.status : null;
  }

  async isActiveMember(userId: number, communityId: number): Promise<boolean> {
    const status = await this.getSubscriptionStatus(userId, communityId);
    return status === CommunitySubscriptionStatus.ACTIVE;
  }

  async isBlocked(userId: number, communityId: number): Promise<boolean> {
    const status = await this.getSubscriptionStatus(userId, communityId);
    return status === CommunitySubscriptionStatus.BLOCKED;
  }

  async activateSubscription(
    userId: number,
    communityId: number,
  ): Promise<CommunitySubscription> {
    const subscription = await this.findOne(userId, communityId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found.');
    }
    if (subscription.status === CommunitySubscriptionStatus.BLOCKED) {
      throw new ConflictException('User is blocked from this community');
    }
    if (subscription.status === CommunitySubscriptionStatus.ACTIVE) {
      return subscription;
    }
    subscription.status = CommunitySubscriptionStatus.ACTIVE;
    return this.subscriptionsRepository.save(subscription);
  }
}
