import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'destructive'
  | 'accent';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:     'bg-[#242424] hover:bg-[#3a3a3a] text-white border border-[#242424] focus-visible:ring-[#242424]',
  secondary:   'bg-white hover:bg-[#F7F7F4] text-[#242424] border border-[#E4E4DF] hover:border-[#C8C8C2] focus-visible:ring-[#242424]',
  outline:     'bg-white hover:bg-[#F7F7F4] text-[#242424] border border-[#E4E4DF] focus-visible:ring-[#242424]',
  ghost:       'bg-transparent hover:bg-[#F7F7F4] text-[#242424] border border-transparent focus-visible:ring-[#242424]',
  destructive: 'bg-rose-700 hover:bg-rose-800 text-white border border-transparent focus-visible:ring-rose-600',
  accent:      'bg-[#B45F3C] hover:bg-[#91482D] text-white border border-transparent focus-visible:ring-[#B45F3C]'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-md gap-1.5',
  md: 'px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-sm font-semibold rounded-lg gap-2'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
  const widthClass = fullWidth ? 'w-full' : '';
  const variantClass = variantStyles[variant] || variantStyles.primary;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
