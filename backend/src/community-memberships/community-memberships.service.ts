import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm'; // Added DataSource
import { User } from '../users/entities/user.entity';
// import { CommunitiesService } from '../communities/communities.service'; // This import is removed
import { Community } from '../communities/entities/community.entity'; // Added Community entity

import { CommunityMembership } from './entities/community-memberships.entity';
import { CommunityMembershipRole } from './types';

interface MembershipQuery {
  userId?: number;
  communityId?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class CommunityMembershipsService {
  constructor(
    @InjectRepository(CommunityMembership)
    private readonly membershipsRepository: Repository<CommunityMembership>,
    // private readonly communitiesService: CommunitiesService, // This is removed
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Community) // Injected Community repository
    private readonly communityRepository: Repository<Community>,
    private dataSource: DataSource, // Injected DataSource
  ) { }


  async findMemberships(query: MembershipQuery): Promise<{ data: CommunityMembership[]; count: number }> {
    const where: any = {};
    const relations: string[] = ['user']; // Always push 'user' relation

    if (query.userId) {
      where.userId = query.userId;
      relations.push('community'); 
    }

    if (query.communityId) {
      where.communityId = query.communityId;
    }

    const options: any = { where, relations };

    // Pagination
    if (query.page !== undefined && query.limit !== undefined) {
      const page = Math.max(1, query.page);
      const limit = Math.max(1, query.limit);
      options.skip = (page - 1) * limit;
      options.take = limit;
    }

    const [data, count] = await this.membershipsRepository.findAndCount(options);
    return { data, count };
  }

  async findOne(userId: number, communityId: number): Promise<CommunityMembership | null> {
    return this.membershipsRepository.findOne({
      where: { userId, communityId },
    });
  }
  // -----------------------------
  // 1️⃣ Self-leave
  // -----------------------------
  async leaveCommunity(userId: number, communityId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const community = await queryRunner.manager.findOne(Community, { where: { id: communityId } });
      if (!community) throw new NotFoundException(`Community ${communityId} not found`);

      const membership = await queryRunner.manager.findOne(CommunityMembership, {
        where: { userId, communityId },
      });
      if (!membership) throw new NotFoundException(`You are not a member of community ${communityId}`);

      await queryRunner.manager.remove(membership);
      await queryRunner.manager.decrement(Community, { id: communityId }, 'membersCount', 1);

      await queryRunner.commitTransaction();
      return { message: 'Left community successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // -----------------------------
  // 2️⃣ Moderator removal
  // -----------------------------
  async removeMember(actorUserId: number, targetUserId: number, communityId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const community = await queryRunner.manager.findOne(Community, { where: { id: communityId } });
      if (!community) throw new NotFoundException(`Community ${communityId} not found`);

      const actorMembership = await queryRunner.manager.findOne(CommunityMembership, {
        where: { userId: actorUserId, communityId },
      });
      if (!actorMembership || actorMembership.role !== CommunityMembershipRole.MODERATOR) {
        throw new ForbiddenException('Only moderators can remove members.');
      }

      const targetMembership = await queryRunner.manager.findOne(CommunityMembership, {
        where: { userId: targetUserId, communityId },
      });
      if (!targetMembership) throw new NotFoundException(`Target user is not a member of this community`);

      // --- Rank check: lower number = higher rank ---
      if (
        targetMembership.role === CommunityMembershipRole.MODERATOR &&
        actorMembership.rank && targetMembership.rank && actorMembership.rank >= targetMembership.rank // actor.rank higher or equal number = lower/equal authority
      ) {
        throw new ForbiddenException('Cannot remove a moderator with equal or higher rank.');
      }

      await queryRunner.manager.remove(targetMembership);
      await queryRunner.manager.decrement(Community, { id: communityId }, 'membersCount', 1);

      await queryRunner.commitTransaction();
      return { message: 'Member removed successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

}
