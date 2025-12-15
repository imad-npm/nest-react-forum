
export class ResponseDto<T> {
  data: T;

  message?: string;

  meta?: {
    count?: number;
    total?: number;
    [key: string]: any;
  };

  constructor(data: T, message?: string, meta?: { count?: number; total?: number; [key: string]: any }) {
    this.data = data;
    this.message = message;
    this.meta = meta;
  }
}
