import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Community } from '../entities/community.entity';
import { CommunityType } from '../types'; // Import CommunityType

@Exclude()
export class CommunityResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly name: string;
  @Expose() readonly displayName: string;
  @Expose() readonly description: string;
  @Expose() isPublic: boolean;
  @Expose() readonly membersCount: number;
  @Expose() readonly createdAt: Date;

  static fromEntity(entity: Community): CommunityResponseDto {
    const dto = plainToInstance(CommunityResponseDto, entity, {
      excludeExtraneousValues: true,
    });
    dto.isPublic = entity.communityType === CommunityType.PUBLIC;
    return dto;
  }
}