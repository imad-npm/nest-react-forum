export interface RegisterDto {
    name: string;
    email: string;
    password: string;
  }
  
  export interface LoginDto {
    email: string;
    password: string;
  }

  export interface UserResponseDto {
    id: string;
    username: string;
    email: string;
  }

  export interface ResponseDto<T> {
    data: T;
    message: string;
  }
  