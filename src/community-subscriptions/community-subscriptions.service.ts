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

@Injectable()
export class CommunitySubscriptionsService {
  constructor(
    @InjectRepository(CommunitySubscription)
    private readonly subscriptionsRepository: Repository<CommunitySubscription>,
    private readonly communitiesService: CommunitiesService,
  ) {}

  async subscribe(communityId: number, userId: number) {
    const community = await this.communitiesService.findOne(communityId);

    const existingSubscription = await this.subscriptionsRepository.findOne({
      where: {
        userId: userId,
        communityId: community.id,
      },
    });

    if (existingSubscription) {
      throw new ConflictException(
        `User ${userId} is already subscribed to community ${community.id}`,
      );
    }

    const subscription = this.subscriptionsRepository.create({
      userId: userId,
      communityId: community.id,
    });

    return this.subscriptionsRepository.save(subscription);
  }

  async unsubscribe(communityId: number, userId: number) {
    const community = await this.communitiesService.findOne(communityId);

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
    return { message: 'Unsubscribed successfully' };
  }

async findSubscriptions(filters: { userId?: number; communityId?: number }) {
  const where: any = {};
  const relations: string[] = [];

  if (filters.userId) {
    where.userId = filters.userId;
    relations.push('community');
  }

  if (filters.communityId) {
    where.communityId = filters.communityId;
    relations.push('user');
  }

  return this.subscriptionsRepository.find({ where, relations });
}

}
