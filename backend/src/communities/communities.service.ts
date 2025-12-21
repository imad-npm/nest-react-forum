import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Community } from './entities/community.entity';
import { CommunityType } from './types';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communitiesRepository: Repository<Community>,
  ) {}

  async create(
    data: {
    userId: number ;
      name: string;
      displayName?: string;
      description?: string;
      communityType?: CommunityType;
    },
  ) {
    const existingCommunity = await this.communitiesRepository.findOne({
      where: { name: data.name },
    });

    if (existingCommunity) {
      throw new ConflictException('Community with this name already exists.');
    }

    const community = this.communitiesRepository.create({
      ...data,
      createdBy: { id: data.userId }, // just pass an object with the id
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
    .leftJoinAndSelect('community.createdBy', 'createdBy')
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

  async findOne(id: number) {
    const community = await this.communitiesRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found.`);
    }
    return community;
  }

  async findByName(name: string) {
    const community = await this.communitiesRepository.findOne({
      where: { name },
      relations: ['createdBy'],
    });
    if (!community) {
      throw new NotFoundException(`Community with name "${name}" not found.`);
    }
    return community;
  }

  async update(
    data: {
      id: number;
      name?: string;
      displayName?: string;
      description?: string;
      communityType?: CommunityType;
      subscribersCount?: number
    },
  ) {
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
}
