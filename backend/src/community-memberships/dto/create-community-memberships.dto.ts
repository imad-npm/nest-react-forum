import { IsNumber } from 'class-validator';

export class CreateCommunityMembershipDto {
  @IsNumber()
  communityId: number;
}
