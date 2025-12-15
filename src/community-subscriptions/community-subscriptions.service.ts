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
    private readonly usersService: UsersService, // <--- inject here
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

  async subscribe(communityId: number, userId: number) {

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
    return { message: 'Unsubscribed successfully' };
  }

}
