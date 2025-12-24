import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityModerator } from './entities/community-moderator.entity';
import { UsersService } from '../users/users.service';
import { CommunitiesService } from '../communities/communities.service';
import { CommunitySubscriptionsService } from '../community-memberships/community-memberships.service';
import { User } from 'src/users/entities/user.entity';
import { CommunitySubscriptionStatus } from 'src/community-memberships/types';

@Injectable()
export class CommunityModeratorsService {
  constructor(
    @InjectRepository(CommunityModerator)
    private readonly communityModeratorRepository: Repository<CommunityModerator>,
    private readonly usersService: UsersService,
    private readonly communitiesService: CommunitiesService,
    private readonly subscriptionsService: CommunitySubscriptionsService,
  ) {}

  async create(options: {
    userId: number;
    communityId: number;
    currentUser: User;
  }): Promise<CommunityModerator> {
    const { userId, communityId, currentUser } = options;

    const community = await this.communitiesService.findOne(communityId);
    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    if (community.ownerId !== currentUser.id) {
      throw new ForbiddenException('You are not the owner of this community');
    }

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.emailVerifiedAt) {
      throw new BadRequestException('User is not active');
    }

    const isModerator = await this.communityModeratorRepository.exist({
      where: { moderatorId: userId, communityId },
    });

    if (isModerator) {
      throw new ConflictException('User is already a moderator');
    }

    const subscription = await this.subscriptionsService.findOne(
      userId,
      communityId,
    );

    if (subscription) {
      if (subscription.status === CommunitySubscriptionStatus.BLOCKED) {
        throw new BadRequestException(
          'Blocked users cannot be made moderators.',
        );
      }
      if (subscription.status === CommunitySubscriptionStatus.PENDING) {
        await this.subscriptionsService.activateSubscription(
          userId,
          communityId,
        );
      }
    } else {
      await this.subscriptionsService.subscribe({
        userId,
        communityId,
        activate: true,
      });
    }

    const moderatorEntity = this.communityModeratorRepository.create({
      moderator: user,
      community,
    });
    return this.communityModeratorRepository.save(moderatorEntity);
  }

  async findAll(options: {
    communityId: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: CommunityModerator[]; count: number }> {
    const { communityId, page = 1, limit = 10 } = options;
    const [data, count] = await this.communityModeratorRepository
      .createQueryBuilder('moderator')
      .where('moderator.communityId = :communityId', { communityId })
      .leftJoinAndSelect('moderator.moderator', 'user')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { data, count };
  }

  async findOne(options: {
    moderatorId: number;
    communityId: number;
  }): Promise<CommunityModerator> {
    const { moderatorId, communityId } = options;
    const communityModerator = await this.communityModeratorRepository.findOne({
      where: { moderatorId, communityId },
      relations: ['moderator', 'community'],
    });
    if (!communityModerator) {
      throw new NotFoundException(
        `CommunityModerator with moderator ID ${moderatorId} and community ID ${communityId} not found`,
      );
    }
    return communityModerator;
  }

  async remove(options: {
    moderatorId: number;
    communityId: number;
    currentUser: User;
  }): Promise<void> {
    const { moderatorId, communityId, currentUser } = options;

    const community = await this.communitiesService.findOne(communityId);
    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    if (community.ownerId !== currentUser.id) {
      throw new ForbiddenException('You are not the owner of this community');
    }

    const moderator = await this.communityModeratorRepository.findOne({
      where: { moderatorId, communityId },
    });

    if (!moderator) {
      throw new NotFoundException('Moderator not found');
    }

    await this.communityModeratorRepository.delete({ moderatorId, communityId });
  }
}
