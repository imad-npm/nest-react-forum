import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CommunitiesService } from '../communities/communities.service';

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
    private readonly communitiesService: CommunitiesService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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

  async createMembership(input: {
    userId: number;
    communityId: number;
    activate?: boolean;
  }) {
    const { userId, communityId, activate } = input;

    // Check community existence
    const community = await this.communitiesService.findOne(communityId);
    if (!community) {
      throw new NotFoundException(`Community ${communityId} not found`);
    }

    const userExists = await this.usersRepository.exist({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`User ${userId} not found`);
    }


    const existingMembership = await this.membershipsRepository.findOne({
      where: {
        userId: userId,
        communityId: community.id,
      },
    });

    if (existingMembership) {

      throw new ConflictException(
        `User ${userId} is already member of to community ${community.id}`,
      );
    }

    const communityType = community.communityType;


    const membership = this.membershipsRepository.create({
      userId: userId,
      communityId: community.id,
    });

    const savedMembership = await this.membershipsRepository.save(
      membership,
    );

    await this.communitiesService.update({
      id: community.id,
      membersCount: community.membersCount + 1,
    });

    return savedMembership;
  }

  async deleteMembership(communityId: number, userId: number) {

    // Check community existence
    const community = await this.communitiesService.findOne(communityId);
    if (!community) throw new NotFoundException(`Community ${communityId} not found`);

    // Check user existence via UsersService
    const userExists = await this.usersRepository.exist({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`User ${userId} not found`);
    }


    const existingMembership = await this.membershipsRepository.findOne({
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

    await this.membershipsRepository.remove(existingMembership);

    await this.communitiesService.update({
      id: community.id,
      membersCount: community.membersCount - 1,
    });

    return { message: 'Unmember of successfully' };
  }



}
