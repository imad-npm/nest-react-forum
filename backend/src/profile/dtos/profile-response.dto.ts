import { Expose } from 'class-transformer';
import { Profile } from '../entities/profile.entity';

export class ProfileResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  bio: string | null;

  @Expose()
  picture: string | null;

  /**
   * Factory method: converts a Profile entity into this DTO.
   * Purely copies values; no business or environment logic.
   */
  static fromEntity(entity: Profile): ProfileResponseDto {
    const dto = new ProfileResponseDto();
    dto.id = entity.id;
    dto.username = entity.username;
    dto.bio = entity.bio ?? null;
    dto.picture = entity.picture ?? null;
    return dto;
  }
}
