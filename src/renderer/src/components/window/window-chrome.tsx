import React from 'react'
import { cn } from '@/lib/cn'

interface WindowChromeProps {
  title: string
  subTitle?: string
  shortDescription?: string
  className?: string
}

export const WindowChrome = ({
  title,
  subTitle,
  shortDescription,
  className,
}: WindowChromeProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'app-region-drag flex items-center justify-between gap-2 border-b bg-background/70 pl-20 pr-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}
    >
      {/* Left: Title */}
      <div className="text-sm font-medium text-foreground">{title}</div>

      {/* Center: SubTitle */}
      {subTitle && (
        <div className="flex-1 flex justify-center">
          <div className="text-xs text-muted-foreground">{subTitle}</div>
        </div>
      )}

      {/* Right: ShortDescription */}
      {shortDescription && <div className="text-xs text-muted-foreground">{shortDescription}</div>}
    </div>
  )
}
