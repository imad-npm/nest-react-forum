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
import { DataSource, Repository } from 'typeorm'; // Added DataSource
import { CommunityMembership } from '../community-memberships/entities/community-memberships.entity';
import { User } from '../users/entities/user.entity';
import { Community } from '../communities/entities/community.entity';
import { CommunityMembershipRole } from '../community-memberships/types';
import { CommunityType } from '../communities/types';

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
    private dataSource: DataSource, // Injected DataSource
  ) {}

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
  async rejectMembershipRequest(requestId: number, adminId: number) {
    const request = await this.requestRepository.findOne({
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
    const adminMembership = await this.membershipRepository.findOne({
      where: {
        userId: adminId,
        communityId: request.community.id,
        role: CommunityMembershipRole.ADMIN, // Only admin can reject for now
      },
    });

    // Currently only the community owner can accept requests
    if (request.community.ownerId !== adminId) {
        throw new BadRequestException('Only the community owner can reject membership requests');
    }

    if (!adminMembership && request.community.ownerId !== adminId) {
      throw new BadRequestException('Admin is not authorized to reject this request');
    }

    request.status = CommunityMembershipRequestStatus.REJECTED;
    return this.requestRepository.save(request);
  }

  async getCommunityMembershipRequests(communityId: number) {
    return this.requestRepository.find({
      where: { communityId, status: CommunityMembershipRequestStatus.PENDING },
      relations: ['user', 'community'],
    });
  }
}
