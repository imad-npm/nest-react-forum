import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Community } from '../entities/community.entity';

@Exclude()
export class CommunityResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly name: string;
  @Expose() readonly displayName: string;
  @Expose() readonly description: string;
  @Expose() readonly isPublic: boolean;
  @Expose() readonly subscribersCount: number;
  @Expose() readonly createdAt: Date;

  static fromEntity(entity: Community): CommunityResponseDto {
    return plainToInstance(CommunityResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}