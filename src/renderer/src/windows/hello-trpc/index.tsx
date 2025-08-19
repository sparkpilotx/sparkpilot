import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionHeader } from './shared-components'
import { TourProvider, TourNavigation, useTour } from './tour-system'
import {
  DatabaseHealthFeature,
  EchoMutationFeature,
  LiveTicksFeature,
  InfiniteLettersFeature,
  CacheManagementFeature,
} from './features'

// Simple error boundary component
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class SimpleErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: (error: Error, reset: () => void) => React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: {
    children: React.ReactNode
    fallback?: (error: Error, reset: () => void) => React.ReactNode
  }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      const reset = (): void => this.setState({ hasError: false, error: undefined })

      if (this.props.fallback) {
        return this.props.fallback(this.state.error, reset)
      }

      return (
        <Card className="border-red-200 dark:border-red-800 shadow-lg">
          <CardContent className="p-6">
            <SectionHeader
              title="Something went wrong"
              subtitle="An unexpected error occurred in the tRPC demonstration"
              badge="Error"
            />
            <div className="space-y-4">
              <div className="text-sm text-destructive font-mono bg-destructive/10 p-3 rounded-lg">
                {this.state.error.message}
              </div>
              <Button variant="outline" onClick={reset} className="w-full">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Window chrome with native macOS styling
function WindowChrome(): React.JSX.Element {
  return (
    <div className="app-region-drag flex items-center justify-between gap-2 border-b border-border/50 bg-background/80 backdrop-blur-xl pl-20 pr-6 py-3 supports-[backdrop-filter]:bg-background/60">
      <div className="text-sm font-medium text-foreground tracking-tight">
        SparkPilot • tRPC Interactive Guide
      </div>
      <div className="app-region-no-drag text-xs text-muted-foreground">
        End-to-end typesafe APIs
      </div>
    </div>
  )
}

// Main content area with conditional rendering based on tour state
function MainContent(): React.JSX.Element {
  const { tourState } = useTour()

  if (!tourState.hasStarted) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <TourNavigation />
        </div>
      </div>
    )
  }

  const currentStep = tourState.steps[tourState.currentStep]

  return (
    <div className="flex flex-1 flex-col p-6 space-y-6">
      {/* Tour Navigation - Always visible during tour */}
      <div className="w-full">
        <TourNavigation />
      </div>

      {/* Feature Content - Progressive disclosure based on current step */}
      <div className="flex-1 w-full max-w-4xl mx-auto">
        <SimpleErrorBoundary>
          {currentStep.id === 'welcome' && (
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <SectionHeader
                  title="Welcome to tRPC"
                  subtitle="Let's explore the building blocks of end-to-end typesafe APIs"
                />
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p className="leading-relaxed">
                    tRPC enables you to easily build & consume fully typesafe APIs without schemas
                    or code generation. This interactive guide will walk you through all the core
                    concepts with working examples.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">What you'll learn:</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Queries with queryOptions</li>
                        <li>• Mutations with mutationOptions</li>
                        <li>• Real-time subscriptions</li>
                        <li>• Infinite pagination</li>
                        <li>• Cache management</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Interactive features:</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Working database connections</li>
                        <li>• Live data transformations</li>
                        <li>• Real-time SSE streams</li>
                        <li>• Pagination controls</li>
                        <li>• Cache inspection tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep.id === 'queries' && <DatabaseHealthFeature />}
          {currentStep.id === 'mutations' && <EchoMutationFeature />}
          {currentStep.id === 'subscriptions' && <LiveTicksFeature />}
          {currentStep.id === 'infinite' && <InfiniteLettersFeature />}
          {currentStep.id === 'cache' && <CacheManagementFeature />}
        </SimpleErrorBoundary>
      </div>
    </div>
  )
}

// Main component
type HelloTrpcProps = {}
const HelloTrpc = ({}: HelloTrpcProps): React.JSX.Element => {
  return (
    <SimpleErrorBoundary>
      <TourProvider>
        <div className="flex h-screen flex-col bg-gradient-to-br from-background to-background/50">
          <WindowChrome />
          <MainContent />
        </div>
      </TourProvider>
    </SimpleErrorBoundary>
  )
}

export default HelloTrpc
