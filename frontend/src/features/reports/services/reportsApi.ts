import { apiSlice } from "../../../shared/services/apiSlice";
import type { ResponseDto } from "../../auth/types";
import type { Report, ReportQueryDto } from "../types";

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<
      ResponseDto<Report[]>,
      ReportQueryDto
    >({
      query: (params) => ({
        url: `/communities/${params.communityId}/reports`,
        params,
      }),
      providesTags: ["Reports"],
    }),
    dismissReport: builder.mutation<
      ResponseDto<boolean>,
      { communityId: number; reportId: number }
    >({
      query: ({ communityId, reportId }) => ({
        url: `/communities/${communityId}/reports/${reportId}/dismiss`,
        method: "POST",
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useDismissReportMutation,
} = reportsApi;
