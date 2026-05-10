import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <input
          ref={ref}
          className={`flex h-12 w-full rounded-[16px] border bg-input-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-destructive mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
