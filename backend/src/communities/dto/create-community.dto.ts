import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { CommunityType } from '../community-type.enum';

export class CreateCommunityDto {
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-z0-9\-]+$/, {
    message: 'Name can only contain lowercase letters, numbers, and hyphens.',
  })
  name: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  displayName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CommunityType)
  communityType?: CommunityType;
}
