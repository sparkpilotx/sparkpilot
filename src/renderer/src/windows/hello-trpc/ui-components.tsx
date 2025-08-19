import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

// Card wrapper using shadcn/ui Card
const cardVariants = cva('', {
  variants: {
    variant: {
      default: '',
      feature: 'shadow-lg',
      tour: 'bg-primary/5 border-dashed',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export interface NativeCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
}

export const NativeCard = React.forwardRef<HTMLDivElement, NativeCardProps>(
  ({ className, variant, size, children, ...props }, ref): React.JSX.Element => {
    const cardSizeClasses = {
      sm: 'p-4',
      md: 'p-6', 
      lg: 'p-8',
    }

    return (
      <Card ref={ref} className={cn(cardVariants({ variant }), className)} {...props}>
        <CardContent className={cn(cardSizeClasses[size || 'md'])}>
          {children}
        </CardContent>
      </Card>
    )
  },
)
NativeCard.displayName = 'NativeCard'

// Section header using shadcn/ui Badge
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
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  )
}

// Status indicator (keeping original logic)
const statusVariants = cva('inline-flex items-center gap-1.5 text-xs font-medium', {
  variants: {
    status: {
      idle: 'text-muted-foreground',
      loading: 'text-ring',
      success: 'text-primary',
      error: 'text-destructive',
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
          'bg-ring animate-pulse': status === 'loading',
          'bg-primary': status === 'success',
          'bg-destructive': status === 'error',
        })}
      />
      {children}
      {dots}
    </div>
  )
}

// Input wrapper using shadcn/ui Input
export interface NativeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const NativeInput = React.forwardRef<HTMLInputElement, NativeInputProps>(
  ({ label, error, className, ...props }, ref): React.JSX.Element => {
    return (
      <div className="space-y-1">
        {label && <label className="text-xs font-medium text-foreground/80">{label}</label>}
        <Input
          ref={ref}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  },
)
NativeInput.displayName = 'NativeInput'

// Button wrapper using shadcn/ui Button
export interface NativeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  isLoading?: boolean
}

export const NativeButton = React.forwardRef<HTMLButtonElement, NativeButtonProps>(
  (
    { className, variant, size, children, isLoading, disabled, ...props },
    ref,
  ): React.JSX.Element => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </Button>
    )
  },
)
NativeButton.displayName = 'NativeButton'

// Progress bar using shadcn/ui Progress
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
      <Progress value={percentage} className="h-1.5" />
    </div>
  )
}