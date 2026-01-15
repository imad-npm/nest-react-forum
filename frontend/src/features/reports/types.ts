
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
export const Reportable = {
  POST: "post",
  COMMENT: "comment",
  USER: "user",
} as const;

export type Reportable = (typeof Reportable)[keyof typeof Reportable];

export const ReportStatus = {
  PENDING: "pending",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
} as const;

export const ReportReason = {
  HARASSMENT: 'HARASSMENT',
  VIOLENCE: 'VIOLENCE',
  HATE_CONTENT: 'HATE_CONTENT',
  MINOR_ABUSE: 'MINOR_ABUSE_OR_SEXUALIZATION',
  PII: 'PII',
  INVOLUNTARY_PORN: 'INVOLUNTARY_PORN',
  PROHIBITED_SALES: 'PROHIBITED_SALES',
  IMPERSONATION: 'IMPERSONATION',
  MANIPULATED_CONTENT: 'MANIPULATED_CONTENT',
  COPYRIGHT: 'COPYRIGHT',
  TRADEMARK: 'TRADEMARK',
  SELF_HARM: 'SELF_HARM',
  SPAM: 'SPAM',
  CONTRIBUTOR_PROGRAM: 'CONTRIBUTOR_PROGRAM',
  COMMUNITY_RULES: 'COMMUNITY_RULES',
} as const;

export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason];

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export interface CreateReportDto {
  reason: ReportReason;
  reportableType: Reportable;
  reportableId: number;
  description?: string;
}
