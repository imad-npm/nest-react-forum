import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { ReactionType } from '../reactions.types';

@Exclude()
export class ReactionResponseDto {
  @Expose() readonly id: number;
  @Expose() readonly type: ReactionType;
  @Expose() @Type(() => UserResponseDto) readonly user: UserResponseDto;

  // Polymorphic target fields
  @Expose() readonly reactableId: number;
  @Expose() readonly reactableType: string;

  @Expose() readonly createdAt: Date;

  static fromEntity(entity: any): ReactionResponseDto {
    // plainToInstance ignores extra fields if excludeExtraneousValues=true
    const dto = plainToInstance(
      ReactionResponseDto,
      {
        ...entity,
        user: entity.user ? UserResponseDto.fromEntity(entity.user) : null,
      },
      { excludeExtraneousValues: true },
    );

    return dto;
  }
}
