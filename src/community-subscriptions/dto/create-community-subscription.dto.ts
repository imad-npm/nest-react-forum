import { IsNumber } from 'class-validator';

export class CreateCommunitySubscriptionDto {
  @IsNumber()
  communityId: number;
}
