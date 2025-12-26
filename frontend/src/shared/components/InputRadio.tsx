import React, { type FC } from "react";

interface InputRadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | number; // variant sizes or custom px
  colorClass?: string; // Tailwind class for checked state
  className?: string; // wrapper class
}

const sizeMap: Record<string, string> = {
  sm: "w-4 h-4",   // 16px
  md: "w-6 h-6",   // 24px
  lg: "w-8 h-8",   // 32px
  xl: "w-10 h-10", // 40px
};

export const InputRadio: FC<InputRadioProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  colorClass = "bg-primary-500",
  className = "",
}) => {
  // Determine dimension
  const dimension =
    typeof size === "number" ? `w-[${size}px] h-[${size}px]` : sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-flex items-center justify-center cursor-pointer select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={() => !disabled && onChange(true)}
    >
      {/* Hidden native input for accessibility */}
      <input type="radio" className="sr-only" checked={checked} disabled={disabled} readOnly />

      {/* Custom circle */}
      <div
        className={`border-2 border-gray-300 rounded-full flex items-center justify-center
          ${checked ? `${colorClass} border-transparent` : ""}
          transition-all duration-150
          ${dimension}
        `}
      >
        {checked && (
          <div
            className="bg-white rounded-full"
            style={{
              width: "50%",
              height: "50%",
            }}
          />
        )}
      </div>
    </div>
  );
};
