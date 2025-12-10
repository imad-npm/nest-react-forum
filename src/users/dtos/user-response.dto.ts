import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { User } from '../entities/user.entity';

@Exclude()
export class UserResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly name: string;
  @Expose() readonly email: string;
  @Expose() readonly emailVerifiedAt: Date | null;
  @Expose() readonly provider: string | null;

  static fromEntity(entity: User): UserResponseDto {
    return plainToInstance(UserResponseDto, entity, { excludeExtraneousValues: true });
  }
}
