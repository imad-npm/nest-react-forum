import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommunityMembershipRequest,
  CommunityMembershipRequestStatus,
} from './entities/community-membership-request.entity';
import { Brackets, DataSource, In, Repository } from 'typeorm';
import { CommunityMembership } from '../community-memberships/entities/community-memberships.entity';
import { User } from '../users/entities/user.entity';
import { Community } from '../communities/entities/community.entity';
import { CommunityMembershipRole } from '../community-memberships/types';
import { CommunityType } from '../communities/types';
import {
  CommunityMembershipRequestQueryDto,
  CommunityMembershipRequestSort,
} from './dto/community-membership-request-query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommunityMembershipRequestCreatedEvent } from './events/community-membership-request-created.event';

@Injectable()
export class CommunityMembershipRequestsService {
  constructor(
    @InjectRepository(CommunityMembershipRequest)
    private readonly requestRepository: Repository<CommunityMembershipRequest>,
    @InjectRepository(CommunityMembership)
    private readonly membershipRepository: Repository<CommunityMembership>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  async findMany(
    queryDto: CommunityMembershipRequestQueryDto,
  ): Promise<{ data: CommunityMembershipRequest[]; count: number }> {
    const { page, limit, userId, communityId, status, sort } = queryDto;

    const queryBuilder = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.community', 'community');

    if (userId) {
      queryBuilder.andWhere('request.userId = :userId', { userId });
    }

    if (communityId) {
      queryBuilder.andWhere('request.communityId = :communityId', { communityId });
    }

    if (status) {
      queryBuilder.andWhere('request.status = :status', { status });
    }

    if (sort === CommunityMembershipRequestSort.NEWEST) {
      queryBuilder.orderBy('request.createdAt', 'DESC');
    } else if (sort === CommunityMembershipRequestSort.OLDEST) {
      queryBuilder.orderBy('request.createdAt', 'ASC');
    } else {
      queryBuilder.orderBy('request.createdAt', 'DESC'); // Default sort
    }

    const [data, count] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { data, count };
  }

  async createMembershipRequest(userId: number, communityId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const community = await queryRunner.manager.findOne(Community, {
        where: { id: communityId },
        select: ['id', 'createdById', 'communityType'], // Select communityType
      });
      if (!community) {
        throw new NotFoundException('Community not found');
      }

      const existingMembership = await queryRunner.manager.findOne(CommunityMembership, {
        where: { userId, communityId },
      });
      if (existingMembership) {
        throw new BadRequestException('User is already a member of this community');
      }

      // If community is public, create membership directly
      if (community.communityType === CommunityType.PUBLIC) {
        const membership = queryRunner.manager.create(CommunityMembership, {
          userId,
          communityId,
          role: CommunityMembershipRole.MEMBER, // Default role for auto-membership
        });
        await queryRunner.manager.save(membership);
        await queryRunner.manager.increment(Community, { id: community.id }, 'membersCount', 1);
        await queryRunner.commitTransaction();
        return membership;
      } else {
        // For restricted or private communities, create a pending request
        const existingRequest = await queryRunner.manager.findOne(CommunityMembershipRequest, {
          where: { userId, communityId, status: CommunityMembershipRequestStatus.PENDING },
        });
        if (existingRequest) {
          throw new BadRequestException('Pending request already exists');
        }

        const request = queryRunner.manager.create(CommunityMembershipRequest, {
          userId,
          communityId,
        });
        await queryRunner.manager.save(request);

        // Emit event
        this.eventEmitter.emit(
          'community.membership.request.created',
          new CommunityMembershipRequestCreatedEvent(request),
        );

        await queryRunner.commitTransaction();
        return request;
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
async acceptMembershipRequest(
  actorId: number,
  userId: number,
  communityId: number,
) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  console.log(actorId,userId,communityId);
  

  try {
    // 1. Fetch pending request
    const request = await queryRunner.manager.findOne(
      CommunityMembershipRequest,
      {
        where: {
          userId,
          communityId,
          status: CommunityMembershipRequestStatus.PENDING,
        },
      },
    );

    if (!request) {
      throw new NotFoundException('Pending membership request not found');
    }

    // 2. Authorization: 
  await this.canManageMembershipRequests(actorId,communityId)


    // 3. Create membership (idempotent-safe)
    await queryRunner.manager.insert(CommunityMembership, {
      userId,
      communityId,
      role: CommunityMembershipRole.MEMBER,
    });

    // 4. Mark request accepted
    await queryRunner.manager.update(
      CommunityMembershipRequest,
      { userId, communityId },
      { status: CommunityMembershipRequestStatus.ACCEPTED },
    );

    // 5. Increment members count
    await queryRunner.manager.increment(
      Community,
      { id: communityId },
      'membersCount',
      1,
    );

    await queryRunner.commitTransaction();
    return true;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

async removeMembershipRequest(
  actorId: number,
  userId: number,
  communityId: number,
) {
  // 1️⃣ Check pending request exists
  const request = await this.requestRepository.findOne({
    where: {
      userId,
      communityId,
      status: CommunityMembershipRequestStatus.PENDING,
    },
  });

  if (!request) {
    throw new NotFoundException('Pending membership request not found');
  }

  // 2️⃣ Check actor role in THIS community
 await this.canManageMembershipRequests(actorId,communityId)

  // 3️⃣ Delete request
   await this.requestRepository.delete({ userId: request.userId,communityId:communityId });

  return true;
}
async removeOwnRequest(
  userId: number,
  communityId: number,
): Promise<boolean> {
  const request = await this.requestRepository.findOne({
    where: {
      userId,
      communityId,
      status: CommunityMembershipRequestStatus.PENDING,
    },
  });

  if (!request) {
    throw new NotFoundException('Pending membership request not found');
  }

  await this.requestRepository.delete({
    userId,
    communityId,
    status: CommunityMembershipRequestStatus.PENDING,
  });

  return true;
}
  private async canManageMembershipRequests(actorId: number, communityId: number) {
    const membership = await this.membershipRepository.findOne({
      where: {
        userId: actorId,
        communityId,
        role: In([CommunityMembershipRole.MODERATOR]),
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not allowed to manage membership requests for this community');
    }

    return membership; // optional, in case you want actor info
  }
 }
