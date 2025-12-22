
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityModerator } from './entities/community-moderator.entity';
import { UsersService } from '../users/users.service';
import { CommunitiesService } from '../communities/communities.service';

@Injectable()
export class CommunityModeratorsService {
  constructor(
    @InjectRepository(CommunityModerator)
    private readonly communityModeratorRepository: Repository<CommunityModerator>,
    private readonly usersService: UsersService,
    private readonly communitiesService: CommunitiesService,
  ) {}

  async create(options: {
    userId: number;
    communityId: number;
  }): Promise<CommunityModerator> {
    const { userId, communityId } = options;
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const community = await this.communitiesService.findOne(communityId);
    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
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
  }): Promise<void> {
    const { moderatorId, communityId } = options;
    await this.communityModeratorRepository.delete({ moderatorId, communityId });
  }
}
