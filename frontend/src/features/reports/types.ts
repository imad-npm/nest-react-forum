
export interface Report {
  id: number;
  reason: string;
  createdAt: string;
  userId: number;
  postId?: number;
  commentId?: number;
}

export interface ReportQueryDto {
  communityId: number;
  page: number;
  limit: number;
}
