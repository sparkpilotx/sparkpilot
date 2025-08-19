import React from 'react'
import { trpcClient } from '@/lib/trpc'
import type { TRPCClientErrorLike } from '@trpc/client'
import type { AppRouter } from '@shared/trpc'
import { NativeCard, SectionHeader, StatusIndicator, NativeButton } from '../native-components'
import { useTour } from '../tour-system'

export function LiveTicksFeature(): React.JSX.Element {
  const { markStepCompleted } = useTour()
  const [tick, setTick] = React.useState<string | undefined>(undefined)
  const [error, setError] = React.useState<TRPCClientErrorLike<AppRouter> | undefined>(undefined)
  const [isConnected, setIsConnected] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const unsubscribeRef = React.useRef<(() => void) | undefined>(undefined)

  const connect = React.useCallback((): void => {
    if (isConnected || isConnecting) return

    setIsConnecting(true)
    setError(undefined)

    try {
      const subscription = trpcClient.helloTrpc.ticks.subscribe(undefined, {
        onStarted: () => {
          setIsConnecting(false)
          setIsConnected(true)
          markStepCompleted('subscriptions')
        },
        onData: (data) => {
          setTick(data as string)
        },
        onError: (err) => {
          setError(err as TRPCClientErrorLike<AppRouter>)
          setIsConnecting(false)
          setIsConnected(false)
        },
      })

      // Handle different subscription return types
      if (typeof subscription === 'function') {
        unsubscribeRef.current = subscription
      } else if (
        subscription &&
        typeof (subscription as { unsubscribe?: () => void }).unsubscribe === 'function'
      ) {
        unsubscribeRef.current = () => (subscription as { unsubscribe: () => void }).unsubscribe()
      }
    } catch (err) {
      setError(err as TRPCClientErrorLike<AppRouter>)
      setIsConnecting(false)
      setIsConnected(false)
    }
  }, [isConnected, isConnecting, markStepCompleted])

  const disconnect = React.useCallback((): void => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = undefined
    }
    setIsConnected(false)
    setIsConnecting(false)
    setTick(undefined)
  }, [])

  // Auto-connect when component mounts
  React.useEffect(() => {
    const timer = setTimeout(connect, 1000)
    return () => clearTimeout(timer)
  }, [connect])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  const getStatusInfo = (): {
    status: 'idle' | 'loading' | 'success' | 'error'
    message: string
  } => {
    if (isConnecting) {
      return { status: 'loading', message: 'Connecting to live stream' }
    }
    if (error) {
      return { status: 'error', message: `Connection failed: ${error.message}` }
    }
    if (isConnected) {
      return { status: 'success', message: 'Receiving live updates' }
    }
    return { status: 'idle', message: 'Ready to connect' }
  }

  const { status, message } = getStatusInfo()

  const formatTimestamp = (timestamp: string): { time: string; date: string } => {
    const date = new Date(timestamp)
    return {
      time: date.toLocaleTimeString(),
      date: date.toLocaleDateString(),
    }
  }

  return (
    <NativeCard variant="feature">
      <SectionHeader
        title="Live Timestamps"
        subtitle="Real-time subscriptions via Server-Sent Events"
        badge="Subscription"
      />

      <div className="space-y-4">
        <div className="rounded-lg bg-muted/30 p-4 border border-muted">
          <div className="flex items-center justify-between mb-3">
            <StatusIndicator status={status}>{message}</StatusIndicator>

            <div className="flex gap-2">
              {!isConnected && (
                <NativeButton
                  variant="outline"
                  size="sm"
                  onClick={connect}
                  isLoading={isConnecting}
                >
                  Connect
                </NativeButton>
              )}
              {isConnected && (
                <NativeButton variant="outline" size="sm" onClick={disconnect}>
                  Disconnect
                </NativeButton>
              )}
            </div>
          </div>

          {tick &&
            (() => {
              const { time, date } = formatTimestamp(tick)
              return (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">Current Time</div>
                      <div className="font-mono text-lg text-primary font-semibold">{time}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Date</div>
                      <div className="font-mono text-sm text-foreground">{date}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last update: {new Date(tick).toISOString()}
                  </div>
                </div>
              )
            })()}
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong>Concept:</strong> This uses{' '}
          <code className="text-foreground bg-muted px-1 rounded">
            trpcClient.helloTrpc.ticks.subscribe()
          </code>
          with Server-Sent Events for real-time data streaming. The subscription automatically
          reconnects and handles connection errors gracefully.
        </div>
      </div>
    </NativeCard>
  )
}
