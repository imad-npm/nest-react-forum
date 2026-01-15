// backend/src/community-memberships/dto/update-role.dto.ts
import { IsEnum } from 'class-validator';
import { CommunityMembershipRole } from '../types';



export class UpdateMembershipRoleDto {
  @IsEnum(CommunityMembershipRole)
  role: CommunityMembershipRole;
}