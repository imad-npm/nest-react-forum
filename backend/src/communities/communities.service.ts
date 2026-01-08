import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Community } from './entities/community.entity';
import { CommunityType } from './types';
import { User } from '../users/entities/user.entity';
import { CommunityMembership } from 'src/community-memberships/entities/community-memberships.entity';
import { CommunityMembershipRole } from 'src/community-memberships/types';
import { CommunityMembershipRequest } from 'src/community-membership-requests/entities/community-membership-request.entity';
import { CommunityMembershipRequestStatus } from 'src/community-membership-requests/entities/community-membership-request.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CommunitiesService {
  constructor(    
    private dataSource: DataSource,
    @InjectRepository(Community)
    private readonly communitiesRepository: Repository<Community>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityMembership)
    private readonly membershipRepository: Repository<CommunityMembership>,
    @InjectRepository(CommunityMembershipRequest)
    private readonly membershipRequestRepository: Repository<CommunityMembershipRequest>,
  ) { }

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
      .leftJoinAndSelect('community.createdBy','createdBy')
      .take(limit)
      .skip((page - 1) * limit);

    if (name) queryBuilder.andWhere('community.name LIKE :name', { name: `%${name}%` });
    if (displayName) queryBuilder.andWhere('community.displayName LIKE :displayName', { displayName: `%${displayName}%` });
    if (communityType !== undefined) queryBuilder.andWhere('community.communityType = :communityType', { communityType });
    if (sort === 'popular') queryBuilder.orderBy('community.membersCount', 'DESC');

    return queryBuilder.getManyAndCount();
  }


  async create(data: {
    userId: number;
    name: string;
    displayName?: string;
    description?: string;
    communityType?: CommunityType;
  }) {
    return this.dataSource.transaction(async (manager) => {
      const existingCommunity = await manager.findOne(Community, {
        where: { name: data.name },
      });
      if (existingCommunity) {
        throw new ConflictException('Community with this name already exists.');
      }

      if (!data.displayName) data.displayName = data.name;

      const community = manager.create(Community, {
        ...data,
        createdBy: { id: data.userId },
      });
      const savedCommunity = await manager.save(community);

      const membership = manager.create(CommunityMembership, {
        userId: data.userId,
        communityId: savedCommunity.id,
        role: CommunityMembershipRole.MODERATOR,
        rank: 0,
      });
      await manager.save(membership);
    await manager.increment(
      Community,
      { id: savedCommunity.id },
      'membersCount',
      1,
    );
      return savedCommunity;
    });
  }

  async findOne(id: number, user?: User): Promise<Community> {
    const community = await this.communitiesRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!community) throw new NotFoundException(`Community with ID ${id} not found.`);

    await this.assertUserCanViewCommunity(user?.id, community);

    if (user) {
      const isMember = await this.membershipRepository.exist({
        where: {
          userId: user.id,
          communityId: community.id,
        },
      });
      

      if (isMember) {
        community.userMembershipStatus = 'member';
      } else {
        const pendingRequest = await this.membershipRequestRepository.findOne({
          where: {
            userId: user.id,
            communityId: community.id,
            status: CommunityMembershipRequestStatus.PENDING,
          },
        });

        if (pendingRequest) {
          community.userMembershipStatus = 'pending';
        } else {
          community.userMembershipStatus = 'none';
        }
      }
    } else {
      community.userMembershipStatus = 'none';
    }

    return community;
  }


  async update(data: {
    id: number;
    name?: string;
    displayName?: string;
    description?: string;
    communityType?: CommunityType;
    membersCount?: number;
  }) {
    const { id, name } = data;

    if (name) {
      const existing = await this.communitiesRepository.findOne({
        where: { name, id: Not(id) },
      });
      if (existing) throw new ConflictException('Community name already exists.');
    }

    const community = await this.communitiesRepository.preload(data);
    if (!community) throw new NotFoundException(`Community with ID ${id} not found.`);

    return this.communitiesRepository.save(community);
  }

  async remove(id: number) {
    const community = await this.findOne(id);
    await this.communitiesRepository.remove(community);
  }


  async assertUserCanViewCommunity(
    userId: number | undefined,
    community: Community,
  ): Promise<void> {
    switch (community.communityType) {
      case CommunityType.PUBLIC:
      case CommunityType.RESTRICTED:
        return;

      case CommunityType.PRIVATE:
        if (!userId) {
          throw new ForbiddenException('Login required to view this community');
        }

        const isMember = await this.membershipRepository.exist({
          where: {
            userId,
            communityId: community.id,
          },
        });

        if (!isMember) {
          throw new ForbiddenException('You are not a member of this community');
        }
        return;

      default:
        throw new ForbiddenException('Community is not accessible');
    }
  }

}
