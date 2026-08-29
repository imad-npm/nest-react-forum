import type { ProfileResponseDto } from "../auth/types";

export interface UserQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  provider?: string;
}

// features/auth/types/user.ts
export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  profile?: ProfileResponseDto;
  
}

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];