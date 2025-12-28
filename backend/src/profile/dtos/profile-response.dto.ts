import { Expose, Type } from 'class-transformer'; // Add Type
import { Profile } from '../entities/profile.entity';
import { UserResponseDto } from '../../users/dtos/user-response.dto'; // Import UserResponseDto

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
  @Type(() => UserResponseDto) // Specify the type for nesting
  user: UserResponseDto; // Nested user object

  /**
   * Factory method: converts a Profile entity into this DTO.
   * Purely copies values; no business or environment logic.
   */
  static fromEntity(entity: Profile): ProfileResponseDto {
    const dto = new ProfileResponseDto();
    dto.id = entity.id;
    dto.displayName = entity.displayName;
    dto.bio = entity.bio ?? null;
    dto.picture = entity.picture ?? null;

    // Populate nested user object
    if (entity.user) {
      dto.user = UserResponseDto.fromEntity(entity.user);
    } else {
      console.warn('Profile entity passed to ProfileResponseDto.fromEntity is missing the user relation.');
    }

    return dto;
  }
}
