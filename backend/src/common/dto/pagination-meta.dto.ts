
export class PaginationMetaDto {
  page: number;

  limit: number;

  totalItems: number;

  totalPages: number;

  itemCount: number;

  constructor(page: number, limit: number, totalItems: number, itemCount: number) {
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;
    this.itemCount = itemCount;
    this.totalPages = Math.ceil(this.totalItems / this.limit);
  }
}
