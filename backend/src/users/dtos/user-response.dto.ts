import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { User } from '../entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity'; // Import Profile entity

@Exclude()
export class ProfileResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly displayName: string;
  @Expose() readonly bio: string | null;
  @Expose() readonly picture: string | null;

  static fromEntity(entity: Profile): ProfileResponseDto {
    return plainToInstance(ProfileResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}

@Exclude()
export class UserResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly username: string;
  @Expose() readonly email: string;
  @Expose() readonly emailVerifiedAt: Date | null;
  @Expose() readonly provider: string | null;

  @Expose()
  @Type(() => ProfileResponseDto)
  readonly profile: ProfileResponseDto;

  static fromEntity(entity: User): UserResponseDto {
    return plainToInstance(UserResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
