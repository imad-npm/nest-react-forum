import { Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { Community } from '../entities/community.entity';

export class CommunityResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  displayName: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  isPublic: boolean;

  @Expose()
  subscribersCount: number;

  @Expose()
  @Type(() => UserResponseDto)
  createdBy: UserResponseDto;

  static fromEntity(entity: Community): CommunityResponseDto {
    return plainToInstance(CommunityResponseDto, entity);
  }
}
