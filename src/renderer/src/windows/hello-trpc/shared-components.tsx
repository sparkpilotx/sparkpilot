import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/badge'

// Simple section header component
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

// Status indicator component
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
