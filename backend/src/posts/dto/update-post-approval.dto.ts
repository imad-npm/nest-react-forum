import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdatePostApprovalDto {
  @IsBoolean()
  @IsNotEmpty()
  isApproved: boolean;
}
