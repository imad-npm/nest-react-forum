import { Expose, Type } from 'class-transformer';
import { Profile } from '../entities/profile.entity';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { ConfigService } from '@nestjs/config';

/**
 * DTO for Profile responses.
 * Resolves picture URLs to full URLs automatically.
 */
export class ProfileResponseDto {
  @Expose()
  id: number;

  @Expose()
  displayName: string;

  @Expose()
  bio: string | null;

  @Expose()
  picture: string | null;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  /**
   * Converts Profile entity → DTO
   * @param entity Profile entity
   * @param appDomain Optional backend domain to resolve relative picture paths
   */
  static fromEntity(entity: Profile, appDomain?: string): ProfileResponseDto {
    const dto = new ProfileResponseDto();
    dto.id = entity.id;
    dto.displayName = entity.displayName;
    dto.bio = entity.bio ?? null;

    // ✅ Resolve picture URL if APP_DOMAIN is provided
    if (entity.picture) {
      dto.picture = appDomain
        ? `${appDomain}${entity.picture.startsWith('/') ? '' : '/'}${entity.picture}`
        : entity.picture;
    } else {
      dto.picture = null;
    }

    // Nested user
    if (entity.user) {
      dto.user = UserResponseDto.fromEntity(entity.user);
    } else {
      console.warn('Profile entity missing user relation.');
    }

    return dto;
  }
}
