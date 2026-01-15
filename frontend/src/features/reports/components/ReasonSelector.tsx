import React from 'react';
import { ReportReason } from '../types';
import { InputError } from '../../../shared/components/ui/InputError';

interface ReasonSelectorProps {
  value?: ReportReason;
  onChange: (reason: ReportReason) => void;
  error?: string;
}

export const ReasonSelector: React.FC<ReasonSelectorProps> = ({ value, onChange, error }) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Reason for reporting
      </label>
      <div className="flex gap-2 flex-wrap">
        {Object.values(ReportReason).map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => onChange(reason)}
            className={`px-3 py-2 border rounded text-sm text-left transition-colors
              ${
                value === reason
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
              }
              hover:bg-red-500 hover:text-white`}
          >
            {reason.replaceAll('_', ' ')}
          </button>
        ))}
      </div>
      <InputError message={error} />
    </div>
  );
};
