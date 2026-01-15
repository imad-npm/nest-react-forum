import { apiSlice } from "../../../shared/services/apiSlice";
import type { PaginatedResponse, ResponseDto } from "../../../shared/types";
import type {
  Report,
  ReportQueryDto,
  CreateReportDto,
} from "../types";

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * LIST REPORTS
     */
    getReports: builder.query<
      PaginatedResponse<Report>,
      ReportQueryDto
    >({
      query: (params) => ({
        url: "/reports",
        params,
      }),
      providesTags: ["Reports"],
    }),

    /**
     * CREATE REPORT
     */
    createReport: builder.mutation<
      ResponseDto<Report>,
      CreateReportDto
    >({
      query: (body) => ({
        url: "/reports",
        method: "POST",
        body,
      }),
    }),

    /**
     * DISMISS REPORT (ADMIN)
     */
    dismissReport: builder.mutation<
      ResponseDto<Report>,
      { reportId: number }
    >({
      query: ({ reportId }) => ({
        url: `/reports/${reportId}/dismiss`,
        method: "POST",
      }),
      invalidatesTags: ["Reports"],
    }),

    /**
     * RESOLVE REPORT (ADMIN / MODERATOR)
     */
    resolveReport: builder.mutation<
      ResponseDto<Report>,
      { reportId: number }
    >({
      query: ({ reportId }) => ({
        url: `/reports/${reportId}/resolve`,
        method: "POST",
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useDismissReportMutation,
  useResolveReportMutation,
} = reportsApi;
