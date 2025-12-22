// backend/src/community-moderators/dto/community-moderator-paginated-response.dto.ts
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { CommunityModeratorResponseDto } from './community-moderator-response.dto';

export class CommunityModeratorPaginatedResponseDto extends PaginatedResponseDto<CommunityModeratorResponseDto> {
  data: CommunityModeratorResponseDto[];
}
