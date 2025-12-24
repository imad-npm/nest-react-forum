import { IsNumber } from 'class-validator';

export class CreateCommunityMembershipRequestDto {
  @IsNumber()
  communityId: number;
}
