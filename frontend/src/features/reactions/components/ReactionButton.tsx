import React from 'react';

interface ReactionButtonProps {
    active: boolean;
    icon: React.ReactNode;
    onClick: () => void;
    count?: number; // optional count
    disabled?: boolean;
    type: 'like' | 'dislike';
    ariaLabel?: string;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
    active,
    icon,
    onClick,
    count = 0,
    disabled = false,
    type,
    ariaLabel,
}) => {
    const colorClasses = active
        ? type === 'like'
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            : 'bg-red-100 text-red-600 hover:bg-red-200'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colorClasses}`}
            aria-label={ariaLabel ?? type}
        >
            {icon}
            {count > 0 && <span className="text-sm font-medium">{count}</span>}
        </button>
    );
};
