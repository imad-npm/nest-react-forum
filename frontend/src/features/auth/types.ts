export interface RegisterDto {
    username: string;
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

 

  export interface ResponseDto<T> {
    data: T;
    message: string;
  }

  export interface UpdateUsernameDto {
    username: string;
    currentPassword: string;
  }
  