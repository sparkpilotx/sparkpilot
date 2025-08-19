import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionHeader, StatusIndicator } from '../shared-components'
import { useTour } from '../tour-system'

export function DatabaseHealthFeature(): React.JSX.Element {
  const { markStepCompleted } = useTour()
  const healthQuery = useQuery(trpc.helloTrpc.db.queryOptions())

  const [hasInteracted, setHasInteracted] = React.useState(false)

  // Mark step as completed when user interacts and gets a result
  React.useEffect(() => {
    if (hasInteracted && (healthQuery.data || healthQuery.error)) {
      markStepCompleted('queries')
    }
  }, [hasInteracted, healthQuery.data, healthQuery.error, markStepCompleted])

  const handleRefresh = React.useCallback((): void => {
    setHasInteracted(true)
    void healthQuery.refetch()
  }, [healthQuery])

  const getStatusInfo = (): {
    status: 'idle' | 'loading' | 'success' | 'error'
    message: string
  } => {
    if (healthQuery.isLoading || healthQuery.isFetching) {
      return { status: 'loading', message: 'Checking database connection' }
    }
    if (healthQuery.error) {
      return { status: 'error', message: `Connection failed: ${healthQuery.error.message}` }
    }
    if (healthQuery.data) {
      return { status: 'success', message: `Connected in ${healthQuery.data.durationMs}ms` }
    }
    return { status: 'idle', message: 'Ready to check database' }
  }

  const { status, message } = getStatusInfo()

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <SectionHeader
          title="Database Health Check"
          subtitle="Real-time query demonstrating tRPC's queryOptions pattern"
          badge="Query"
        />

        <div className="space-y-4">
          <div className="rounded-lg bg-muted/30 p-4 border border-muted">
            <div className="flex items-center justify-between mb-3">
              <StatusIndicator status={status}>{message}</StatusIndicator>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={healthQuery.isLoading || healthQuery.isFetching}
              >
                {(healthQuery.isLoading || healthQuery.isFetching) && (
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-2" />
                )}
                Check Health
              </Button>
            </div>

            {healthQuery.data && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-mono text-primary">OK</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Response Time</div>
                  <div className="font-mono text-foreground">{healthQuery.data.durationMs}ms</div>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed">
            <strong>Concept:</strong> This uses{' '}
            <code className="text-foreground bg-muted px-1 rounded">
              trpc.helloTrpc.db.queryOptions()
            </code>
            with TanStack Query's{' '}
            <code className="text-foreground bg-muted px-1 rounded">useQuery</code> hook. The query
            is cached, automatically retried on failure, and provides loading states.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
