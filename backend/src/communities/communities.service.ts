import {
  ConflictException,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Community } from './entities/community.entity';
import { CommunityType } from './types';
import { User } from '../users/entities/user.entity';
import { CommunitySubscriptionsService } from 'src/community-subscriptions/community-subscriptions.service';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communitiesRepository: Repository<Community>,
    private readonly subscriptionsService: CommunitySubscriptionsService, // use service instead of repo  ) {}
  ){
    
  }
  async create(data: {
    userId: number;
    name: string;
    displayName?: string;
    description?: string;
    communityType?: CommunityType;
  }) {
    const existingCommunity = await this.communitiesRepository.findOne({
      where: { name: data.name },
    });

    if (existingCommunity) {
      throw new ConflictException('Community with this name already exists.');
    }

    const community = this.communitiesRepository.create({
      ...data,
      owner: { id: data.userId },
    });

    return this.communitiesRepository.save(community);
  }

  findAll(query: {
    limit?: number;
    page?: number;
    name?: string;
    displayName?: string;
    communityType?: CommunityType;
    sort?: string;
  }) {
    const { limit = 10, page = 1, name, displayName, communityType, sort } = query;
    const queryBuilder = this.communitiesRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.owner', 'owner')
      .take(limit)
      .skip((page - 1) * limit);

    if (name) {
      queryBuilder.andWhere('community.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (displayName) {
      queryBuilder.andWhere('community.displayName LIKE :displayName', {
        displayName: `%${displayName}%`,
      });
    }

    if (communityType !== undefined) {
      queryBuilder.andWhere('community.communityType = :communityType', { communityType });
    }

    if (sort === 'popular') {
      queryBuilder.orderBy('community.subscribersCount', 'DESC');
    }

    return queryBuilder.getManyAndCount();
  }

  async findOne(id: number, user?: User) {
    const community = await this.communitiesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found.`);
    }

    // Enforce visibility rules
    await this.checkCommunityAccess(community, user);

    return community;
  }

  async findByName(name: string, user?: User) {
    const community = await this.communitiesRepository.findOne({
      where: { name },
      relations: ['owner'],
    });
    if (!community) {
      throw new NotFoundException(`Community with name "${name}" not found.`);
    }

    await this.checkCommunityAccess(community, user);

    return community;
  }

  async update(data: {
    id: number;
    name?: string;
    displayName?: string;
    description?: string;
    communityType?: CommunityType;
    subscribersCount?: number;
  }) {
    const { id, name } = data;

    if (name) {
      const existing = await this.communitiesRepository.findOne({
        where: { name, id: Not(id) },
      });
      if (existing) {
        throw new ConflictException('Community name already exists.');
      }
    }

    const community = await this.communitiesRepository.preload(data);
    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found.`);
    }

    return this.communitiesRepository.save(community);
  }

  async remove(id: number) {
    const community = await this.findOne(id);
    await this.communitiesRepository.remove(community);
  }

  /**
   * Checks if the user can contribute (post/comment) to this community.
   */
   private async checkCommunityAccess(community: Community, user?: User) {
    switch (community.communityType) {
      case CommunityType.PUBLIC:
      case CommunityType.RESTRICTED:
        return; // anyone can view
      case CommunityType.PRIVATE:
        if (!user) {
          throw new ForbiddenException('You must be a member to view this community.');
        }
        const isMember = await this.subscriptionsService.isActiveMember(user.id, community.id);
        if (!isMember) {
          throw new ForbiddenException('You must be an approved member to view this community.');
        }
        return;
      default:
        throw new ForbiddenException('Invalid community type.');
    }
  }

 
}
