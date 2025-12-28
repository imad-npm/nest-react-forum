import { useParams } from "react-router-dom";
import { useGetReportsQuery, useDismissReportMutation } from "../services/reportsApi";
import { Button } from "../../../shared/components/ui/Button";

export const ReportsQueue = () => {
  const { communityId } = useParams();
  const { data: reports, isLoading } = useGetReportsQuery({
    communityId: +communityId,
    page: 1,
    limit: 10,
  });
  const [dismiss] = useDismissReportMutation();

  if (isLoading) return <div className="p-4">Loading reports...</div>;

  return (
    <div className="space-y-3">
      {reports?.data.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <p className="text-gray-500 italic">No pending reports to review.</p>
        </div>
      ) : (
        reports?.data.map((report) => (
          <div key={report.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900 text-lg">Report #{report.id}</p>
              <p className="text-sm text-gray-700">{report.reason}</p>
              <p className="text-xs text-gray-500 italic">
                Reported by User #{report.userId} on {new Date(report.createdAt).toLocaleDateString()}
              </p>
              {report.postId && <p className="text-xs text-gray-500">Post ID: {report.postId}</p>}
              {report.commentId && <p className="text-xs text-gray-500">Comment ID: {report.commentId}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => dismiss({ communityId: +communityId, reportId: report.id })} className="bg-blue-600 hover:bg-blue-700">Dismiss</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
