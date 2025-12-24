import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm'; // Added DataSource
import { User } from '../users/entities/user.entity';
// import { CommunitiesService } from '../communities/communities.service'; // This import is removed
import { Community } from '../communities/entities/community.entity'; // Added Community entity

import { CommunityMembership } from './entities/community-memberships.entity';

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

    const [data, count] = await this.membershipsRepository.findAndCount(options);
    return { data, count };
  }

  async findOne(userId: number, communityId: number): Promise<CommunityMembership | null> {
    return this.membershipsRepository.findOne({
      where: { userId, communityId },
    });
  }
  
  async deleteMembership(communityId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check community existence
      const community = await queryRunner.manager.findOne(Community, { where: { id: communityId } });
      if (!community) throw new NotFoundException(`Community ${communityId} not found`);

      // Check user existence via UsersService
      const userExists = await queryRunner.manager.exists(User, {
        where: { id: userId },
      });
      if (!userExists) {
        throw new NotFoundException(`User ${userId} not found`);
      }

      const existingMembership = await queryRunner.manager.findOne(CommunityMembership, {
        where: {
          userId: userId,
          communityId: community.id,
        },
      });

      if (!existingMembership) {
        throw new NotFoundException(
          `User ${userId} is not member of to community ${community.id}`,
        );
      }

      await queryRunner.manager.remove(existingMembership);

      // Decrement membersCount directly using the repository within the transaction
      await queryRunner.manager.decrement(Community, { id: community.id }, 'membersCount', 1);

      await queryRunner.commitTransaction();
      return { message: 'Left community successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }



}
