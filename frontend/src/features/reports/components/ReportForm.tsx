import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../../../shared/components/ui/Button';
import { Textarea } from '../../../shared/components/ui/TextArea';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import { useCreateReportMutation } from '../services/reportsApi';
import { type CreateReportDto, Reportable, ReportReason } from '../types';
import { ReasonSelector } from './ReasonSelector';

interface ReportFormProps {
  reportableId: number;
  reportableType: Reportable;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  reportableId,
  reportableType,
  onSuccess,
  onCancel,
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateReportDto>({
    defaultValues: { reportableId, reportableType },
  });

  const [createReport, { isLoading }] = useCreateReportMutation();
  const { showToast } = useToastContext();

  const onSubmit = async (data: CreateReportDto) => {
    try {
      await createReport(data).unwrap();
      showToast('Report submitted successfully.', 'success');
      onSuccess?.();
    } catch (err: any) {
      showToast(err.data?.message || 'Failed to submit report.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Report {reportableType}
      </h3>

      <Controller
        name="reason"
        control={control}
        rules={{ required: 'Please select a reason' }}
        render={({ field }) => (
          <ReasonSelector
            value={field.value}
            onChange={field.onChange}
            error={errors.reason?.message}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Additional details (optional)
        </label>
        <Textarea
          {...control.register('description')}
          placeholder="Provide more context..."
          className="w-full"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={isLoading}>Submit Report</Button>
      </div>
    </form>
  );
};
