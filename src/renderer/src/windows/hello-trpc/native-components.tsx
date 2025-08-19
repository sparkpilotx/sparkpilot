import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// Native macOS card component with proper spacing and shadows
const cardVariants = cva(
  'rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'shadow-sm hover:shadow-md hover:border-border/80',
        feature: 'shadow-lg border-border/30 hover:shadow-xl hover:border-border/60',
        tour: 'shadow-md border-primary/20 bg-primary/5 hover:shadow-lg',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface NativeCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
}

export const NativeCard = React.forwardRef<HTMLDivElement, NativeCardProps>(
  ({ className, variant, size, children, ...props }, ref): React.JSX.Element => {
    return (
      <div ref={ref} className={cn(cardVariants({ variant, size }), className)} {...props}>
        {children}
      </div>
    )
  },
)
NativeCard.displayName = 'NativeCard'

// Native macOS section header with proper typography
export interface SectionHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  className?: string
}

export const SectionHeader = ({
  title,
  subtitle,
  badge,
  className,
}: SectionHeaderProps): React.JSX.Element => {
  return (
    <div className={cn('mb-4', className)}>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
        {badge && (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  )
}

// Native macOS status indicator
const statusVariants = cva('inline-flex items-center gap-1.5 text-xs font-medium', {
  variants: {
    status: {
      idle: 'text-muted-foreground',
      loading: 'text-blue-600 dark:text-blue-400',
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
    },
  },
})

export interface StatusIndicatorProps extends VariantProps<typeof statusVariants> {
  children: React.ReactNode
  className?: string
}

export const StatusIndicator = ({
  status,
  children,
  className,
}: StatusIndicatorProps): React.JSX.Element => {
  const dots = status === 'loading' ? '...' : ''

  return (
    <div className={cn(statusVariants({ status }), className)}>
      <div
        className={cn('w-2 h-2 rounded-full', {
          'bg-muted-foreground/40': status === 'idle',
          'bg-blue-500 animate-pulse': status === 'loading',
          'bg-green-500': status === 'success',
          'bg-red-500': status === 'error',
        })}
      />
      {children}
      {dots}
    </div>
  )
}

// Native macOS input field
export interface NativeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const NativeInput = React.forwardRef<HTMLInputElement, NativeInputProps>(
  ({ label, error, className, ...props }, ref): React.JSX.Element => {
    return (
      <div className="space-y-1">
        {label && <label className="text-xs font-medium text-foreground/80">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm',
            'placeholder:text-muted-foreground/60',
            'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20',
            'transition-colors duration-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  },
)
NativeInput.displayName = 'NativeInput'

// Native macOS button variants
const nativeButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2',
        lg: 'px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface NativeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof nativeButtonVariants> {
  children: React.ReactNode
  isLoading?: boolean
}

export const NativeButton = React.forwardRef<HTMLButtonElement, NativeButtonProps>(
  (
    { className, variant, size, children, isLoading, disabled, ...props },
    ref,
  ): React.JSX.Element => {
    return (
      <button
        ref={ref}
        className={cn(
          nativeButtonVariants({ variant: variant ?? 'primary', size: size ?? 'md' }),
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  },
)
NativeButton.displayName = 'NativeButton'

// Progress indicator for guided tour
export interface ProgressBarProps {
  progress: number
  total: number
  className?: string
}

export const ProgressBar = ({
  progress,
  total,
  className,
}: ProgressBarProps): React.JSX.Element => {
  const percentage = Math.min(100, Math.max(0, (progress / total) * 100))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-foreground/80">Progress</span>
        <span className="text-xs text-muted-foreground">
          {progress} of {total}
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
