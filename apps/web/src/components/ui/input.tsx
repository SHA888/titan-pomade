import * as React from 'react';
import { cn } from '@/lib/utils';

type BaseInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface InputProps extends Omit<BaseInputProps, 'className'> {
  /** Optional class name */
  className?: string;
  /** Optional error state */
  error?: boolean;
  /** Optional helper text */
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    // Extract base input props (excluding our custom ones)
    const inputProps = props as Omit<BaseInputProps, 'className'>;

    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-body ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            {
              'border-destructive focus-visible:ring-destructive': error,
            },
            className
          )}
          ref={ref}
          {...inputProps}
        />
        {helperText && (
          <p className={cn('text-small', error ? 'text-destructive' : 'text-muted-foreground')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };