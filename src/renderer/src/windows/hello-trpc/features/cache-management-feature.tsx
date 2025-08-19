import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import { NativeCard, SectionHeader, StatusIndicator, NativeButton } from '../ui-components'
import { useTour } from '../tour-system'

export function CacheManagementFeature(): React.JSX.Element {
  const { markStepCompleted } = useTour()
  const queryClient = useQueryClient()
  const [lastAction, setLastAction] = React.useState<string>('')
  const [actionCount, setActionCount] = React.useState(0)

  // Track cache operations for completion
  React.useEffect(() => {
    if (actionCount >= 2) {
      markStepCompleted('cache')
    }
  }, [actionCount, markStepCompleted])

  const handleInvalidateSpecific = React.useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: trpc.helloTrpc.time.queryKey() })
    setLastAction('Invalidated time query cache')
    setActionCount((prev) => prev + 1)
  }, [queryClient])

  const handleInvalidateRouter = React.useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: trpc.helloTrpc.pathKey() })
    setLastAction('Invalidated all helloTrpc queries')
    setActionCount((prev) => prev + 1)
  }, [queryClient])

  const handlePrefetchTime = React.useCallback(async (): Promise<void> => {
    await queryClient.prefetchQuery(trpc.helloTrpc.time.queryOptions())
    setLastAction('Prefetched time query data')
    setActionCount((prev) => prev + 1)
  }, [queryClient])

  const handleFilterInvalidate = React.useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries(
      trpc.helloTrpc.time.queryFilter(undefined, {
        predicate: (query) => Boolean(query.state.data),
      }),
    )
    setLastAction('Invalidated queries with data using filter')
    setActionCount((prev) => prev + 1)
  }, [queryClient])

  const handleClearAll = React.useCallback((): void => {
    queryClient.clear()
    setLastAction('Cleared all query cache')
    setActionCount((prev) => prev + 1)
  }, [queryClient])

  // Get cache statistics
  const cacheStats = React.useMemo(() => {
    const cache = queryClient.getQueryCache()
    const queries = cache.getAll()
    const trpcQueries = queries.filter(
      (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'helloTrpc',
    )

    return {
      total: queries.length,
      trpcQueries: trpcQueries.length,
      stale: queries.filter((query) => query.isStale()).length,
      active: queries.filter((query) => query.getObserversCount() > 0).length,
    }
  }, [queryClient, lastAction]) // Re-compute when actions occur

  const getStatusInfo = (): {
    status: 'idle' | 'loading' | 'success' | 'error'
    message: string
  } => {
    if (actionCount === 0) {
      return { status: 'idle', message: 'Ready to manage query cache' }
    }
    return { status: 'success', message: `Performed ${actionCount} cache operations` }
  }

  const { status, message } = getStatusInfo()

  return (
    <NativeCard variant="feature">
      <SectionHeader
        title="Cache Management"
        subtitle="Control query cache with precision using queryKey, pathKey, and filters"
        badge="Cache Control"
      />

      <div className="space-y-4">
        <div className="rounded-lg bg-muted/30 p-4 border border-muted">
          <div className="flex items-center justify-between mb-3">
            <StatusIndicator status={status}>{message}</StatusIndicator>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs mb-4">
            <div>
              <div className="text-muted-foreground">Total Queries</div>
              <div className="font-mono text-lg text-foreground">{cacheStats.total}</div>
            </div>
            <div>
              <div className="text-muted-foreground">tRPC Queries</div>
              <div className="font-mono text-lg text-primary">{cacheStats.trpcQueries}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Active</div>
              <div className="font-mono text-sm text-primary">{cacheStats.active}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Stale</div>
              <div className="font-mono text-sm text-foreground/70">{cacheStats.stale}</div>
            </div>
          </div>

          {lastAction && (
            <div className="text-xs text-muted-foreground mb-3">
              <strong>Last action:</strong> {lastAction}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <NativeButton variant="outline" size="sm" onClick={handleInvalidateSpecific}>
            Invalidate Time
          </NativeButton>

          <NativeButton variant="outline" size="sm" onClick={handleInvalidateRouter}>
            Invalidate Router
          </NativeButton>

          <NativeButton variant="outline" size="sm" onClick={handlePrefetchTime}>
            Prefetch Time
          </NativeButton>

          <NativeButton variant="outline" size="sm" onClick={handleFilterInvalidate}>
            Filter Invalidate
          </NativeButton>
        </div>

        <NativeButton
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          Clear All Cache
        </NativeButton>

        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong>Concept:</strong> Use{' '}
          <code className="text-foreground bg-muted px-1 rounded">queryKey()</code> for specific
          queries,
          <code className="text-foreground bg-muted px-1 rounded">pathKey()</code> for router-level
          operations, and{' '}
          <code className="text-foreground bg-muted px-1 rounded">queryFilter()</code> for advanced
          cache control with predicates.
        </div>
      </div>
    </NativeCard>
  )
}
