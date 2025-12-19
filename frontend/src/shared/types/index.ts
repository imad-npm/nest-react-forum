export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    itemCount: number;
  };
}

export interface ResponseDto<T> {
  data: T;
  message: string;
}
