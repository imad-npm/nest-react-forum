import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommunityMembershipRequest,
  CommunityMembershipRequestStatus,
} from './entities/community-membership-request.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CommunityMembership } from '../community-memberships/entities/community-memberships.entity';
import { User } from '../users/entities/user.entity';
import { Community } from '../communities/entities/community.entity';
import { CommunityMembershipRole } from '../community-memberships/types';
import { CommunityType } from '../communities/types';
import {
  CommunityMembershipRequestQueryDto,
  CommunityMembershipRequestSort,
} from './dto/community-membership-request-query.dto';

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
        select: ['id', 'ownerId', 'communityType'], // Select communityType
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

  async acceptMembershipRequest(requestId: number, adminId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const request = await queryRunner.manager.findOne(CommunityMembershipRequest, {
        where: { id: requestId },
        relations: ['community'],
      });
      if (!request) {
        throw new NotFoundException('Membership request not found');
      }
      if (request.status !== CommunityMembershipRequestStatus.PENDING) {
        throw new BadRequestException('Request is not pending');
      }

      // Check if adminId is an admin or moderator of the community
      const adminMembership = await queryRunner.manager.findOne(CommunityMembership, {
        where: {
          userId: adminId,
          communityId: request.community.id,
          role: CommunityMembershipRole.ADMIN, // Only admin can accept for now
        },
      });

      // Currently only the community owner can accept requests
      if (request.community.ownerId !== adminId) {
          throw new BadRequestException('Only the community owner can accept membership requests');
      }

      if (!adminMembership && request.community.ownerId !== adminId) {
        throw new BadRequestException('Admin is not authorized to accept this request');
      }

      const membership = queryRunner.manager.create(CommunityMembership, {
        userId: request.userId,
        communityId: request.communityId,
        role: CommunityMembershipRole.MEMBER, // Default role for new members
      });

      await queryRunner.manager.save(membership);

      request.status = CommunityMembershipRequestStatus.ACCEPTED;
      await queryRunner.manager.save(request); // Save the updated request status
      await queryRunner.manager.increment(Community, { id: request.community.id }, 'membersCount', 1); // Increment membersCount

      await queryRunner.commitTransaction();
      return membership; // Return the created membership
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
   async removeMembershipRequest(userId: number, communityId: number) {
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
 
   // Delete the request
   await this.requestRepository.delete({ id: request.id });
 
 }
 }
