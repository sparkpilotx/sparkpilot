import React from 'react'
import { cn } from '@/lib/cn'

interface WindowChromeProps {
  title: string
  className?: string
}

export const WindowChrome = ({ title, className }: WindowChromeProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'app-region-drag flex items-center justify-between gap-2 border-b bg-background/70 pl-20 pr-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}
    >
      <div className="text-sm font-medium text-foreground">{title}</div>
    </div>
  )
}
