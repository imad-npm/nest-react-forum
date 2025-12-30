import { useParams } from 'react-router-dom';
import { useGetReportsQuery, useDismissReportMutation } from '../services/reportsApi';

export const useReportsQueue = () => {
  const { communityId } = useParams();
  const { data: reports, isLoading } = useGetReportsQuery({
    communityId: +communityId,
    page: 1,
    limit: 10,
  });
  const [dismissReport] = useDismissReportMutation();

  const handleDismiss = (reportId: number) => {
    if (communityId) {
      dismissReport({ communityId: +communityId, reportId });
    }
  };

  return {
    reports: reports?.data ?? [],
    isLoading,
    handleDismiss,
  };
};
