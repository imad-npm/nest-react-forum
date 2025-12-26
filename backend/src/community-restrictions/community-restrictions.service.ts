import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityRestriction } from './entities/community-restriction.entity';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Community } from 'src/communities/entities/community.entity';
import { CommunityMembership } from 'src/community-memberships/entities/community-memberships.entity';
import { CommunityMembershipRole } from 'src/community-memberships/types';
import { CommunityRestrictionType } from './community-restrictions.types';

@Injectable()
export class CommunityRestrictionsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CommunityRestriction)
    private readonly communityRestrictionsRepository: Repository<CommunityRestriction>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CommunityMembership)
    private readonly communityMembershipRepository: Repository<CommunityMembership>,
  ) {}

  async create(
    data: {
      restrictionType: CommunityRestrictionType;
      communityId: number;
      userId: number;
    },
    user: User,
  ) {
    const community = await this.communityRepository.findOne({
      where: { id: data.communityId },
    });
    if (!community) {
      throw new NotFoundException('Community not found');
    }

    const targetUser = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    if (!targetUser) {
      throw new NotFoundException('User to restrict not found');
    }

     await this.canManageRestrictions(user.id ,community.id)


    const existingRestriction = await this.communityRestrictionsRepository.findOne({
      where: {
        community: { id: community.id },
        user: { id: targetUser.id },
      },
    });

    if (existingRestriction) {
      throw new ConflictException('This user is already restricted in this community.');
    }

    const restriction = this.communityRestrictionsRepository.create({
      restrictionType: data.restrictionType,
      community,
      user: targetUser,
    });

    return this.communityRestrictionsRepository.save(restriction);
  }

  async findAll(
    query: { communityId?: number; limit?: number; page?: number },
    user: User,
  ) {
    const { communityId, limit = 10, page = 1 } = query;

    const queryBuilder = this.communityRestrictionsRepository
      .createQueryBuilder('restriction')
      .leftJoinAndSelect('restriction.community', 'community')
      .leftJoinAndSelect('restriction.user', 'user')
      .take(limit)
      .skip((page - 1) * limit);

    if (communityId) {
      const community = await this.communityRepository.findOne({
        where: { id: communityId },
      });
      if (!community) {
        throw new NotFoundException('Community not found');
      }

      const membership = await this.communityMembershipRepository.findOne({
        where: { communityId: community.id, userId: user.id },
      });

      if (
        !membership ||
        (membership.role !== CommunityMembershipRole.OWNER &&
          membership.role !== CommunityMembershipRole.MODERATOR)
      ) {
        throw new ForbiddenException(
          'You do not have permission to view restrictions in this community.',
        );
      }
      queryBuilder.andWhere('restriction.communityId = :communityId', { communityId });
    }

    const [data, count] = await queryBuilder.getManyAndCount();
    return { data, count };
  }

  async findOne(id: number, user: User) {
    const restriction = await this.communityRestrictionsRepository.findOne({
      where: { id },
      relations: ['community'],
    });

    if (!restriction) {
      throw new NotFoundException('Restriction not found');
    }

   
      await this.canManageRestrictions(user.id ,restriction.community.id)


    return restriction;
  }

  async update(
    id: number,
    data: { restrictionType?: CommunityRestrictionType },
    user: User,
  ) {
    const restriction = await this.communityRestrictionsRepository.findOne({
      where: { id },
      relations: ['community'],
    });

    if (!restriction) {
      throw new NotFoundException('Restriction not found');
    }

    await this.canManageRestrictions(user.id ,restriction.community.id)


    if (data.restrictionType) {
      restriction.restrictionType = data.restrictionType;
    }

    return this.communityRestrictionsRepository.save(restriction);
  }

  async findOneById(id: number) {
    return this.communityRestrictionsRepository.findOne({
      where: { id },
      relations: ['community', 'user'],
    });
  }

  async remove(id: number, user: User): Promise<boolean> {
    const restriction = await this.communityRestrictionsRepository.findOne({
      where: { id },
      relations: ['community'],
    });

    if (!restriction) {
      throw new NotFoundException('Restriction not found');
    }

   await this.canManageRestrictions(user.id ,restriction.community.id)
    await this.communityRestrictionsRepository.remove(restriction);
    return true;
  }

  private async canManageRestrictions(userId: number, communityId: number) {
  const membership = await this.communityMembershipRepository.findOne({
    where: { communityId, userId },
  });

  if (
    !membership ||
    ![CommunityMembershipRole.OWNER, CommunityMembershipRole.MODERATOR].includes(membership.role)
  ) {
    throw new ForbiddenException('You do not have permission in this community.');
  }

  return membership;
}

}
