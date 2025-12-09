// src/users/dtos/create-user.dto.ts

export class CreateUserDto {
  name: string;
  email: string;
  password?: string | null;
  provider?: 'google' | 'github' | null;
  providerId?: string | null;
  emailVerifiedAt?: Date | null;
  picture?: string | null;
}
