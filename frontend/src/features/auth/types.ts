export interface RegisterDto {
    name: string;
    email: string;
    password: string;
  }
  
  export interface LoginDto {
    email: string;
    password: string;
  }

  export interface ProfileResponseDto {
    id: number;
    displayName: string;
    bio: string | null;
    picture: string | null;
  }

  export interface UserResponseDto {
    id: number;
    username: string;
    email: string;
    profile?: ProfileResponseDto;
  }

  export interface ResponseDto<T> {
    data: T;
    message: string;
  }

  export interface UpdateUsernameDto {
    username: string;
    currentPassword: string;
  }
  