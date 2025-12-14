import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from './entities/community.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communitiesRepository: Repository<Community>,
  ) {}

  async create(
    createCommunityDto: {
      name: string;
      displayName?: string;
      description?: string;
      isPublic?: boolean;
    },
    user: User,
  ) {
    const existingCommunity = await this.communitiesRepository.findOne({
      where: { name: createCommunityDto.name },
    });

    if (existingCommunity) {
      throw new ConflictException('Community with this name already exists.');
    }

    const community = this.communitiesRepository.create({
      ...createCommunityDto,
      createdBy: user,
    });

    return this.communitiesRepository.save(community);
  }

  findAll(
    query: {
      limit?: number;
      offset?: number;
      name?: string;
      displayName?: string;
      isPublic?: boolean;
    },
  ) {
    const { limit, offset, name, displayName, isPublic } = query;
    const queryBuilder = this.communitiesRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.createdBy', 'createdBy')
      .take(limit)
      .skip(offset);

    if (name) {
      queryBuilder.andWhere('community.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    if (displayName) {
      queryBuilder.andWhere('community.displayName ILIKE :displayName', {
        displayName: `%${displayName}%`,
      });
    }

    if (isPublic !== undefined) {
      queryBuilder.andWhere('community.isPublic = :isPublic', { isPublic });
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
    id: number,
    updateCommunityDto: {
      name?: string;
      displayName?: string;
      description?: string;
      isPublic?: boolean;
    },
  ) {
    const community = await this.communitiesRepository.preload({
      id: id,
      ...updateCommunityDto,
    });
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
