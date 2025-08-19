import React from 'react'
import type { TourState, TourStep } from './types'
import { NativeCard, SectionHeader, NativeButton, ProgressBar } from './ui-components'

// Tour configuration with progressive disclosure
export const TOUR_STEPS: Omit<TourStep, 'isCompleted' | 'isActive'>[] = [
  {
    id: 'welcome',
    title: 'Welcome to tRPC',
    description:
      "End-to-end typesafe APIs made easy. Let's explore the core concepts step by step.",
    concept: 'introduction',
    order: 0,
  },
  {
    id: 'queries',
    title: 'Queries',
    description:
      'Fetch data from your server with full type safety. Watch real-time database health checks.',
    concept: 'queryOptions',
    order: 1,
  },
  {
    id: 'mutations',
    title: 'Mutations',
    description: 'Modify server state safely. Try the echo mutation to see how data transforms.',
    concept: 'mutationOptions',
    order: 2,
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    description: 'Real-time data streams via Server-Sent Events. Watch live timestamps update.',
    concept: 'subscriptionOptions',
    order: 3,
  },
  {
    id: 'infinite',
    title: 'Infinite Queries',
    description: 'Paginated data loading made simple. Navigate through the alphabet seamlessly.',
    concept: 'infiniteQueryOptions',
    order: 4,
  },
  {
    id: 'cache',
    title: 'Cache Management',
    description:
      'Control your data cache with precision. Invalidate, prefetch, and filter queries.',
    concept: 'queryKey + pathKey + queryFilter',
    order: 5,
  },
]

// Tour context for state management
interface TourContextValue {
  tourState: TourState
  nextStep: () => void
  previousStep: () => void
  goToStep: (stepIndex: number) => void
  startTour: () => void
  completeTour: () => void
  markStepCompleted: (stepId: string) => void
}

const TourContext = React.createContext<TourContextValue | null>(null)

export function useTour(): TourContextValue {
  const context = React.useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

// Tour provider component
interface TourProviderProps {
  children: React.ReactNode
}

export function TourProvider({ children }: TourProviderProps): React.JSX.Element {
  const [tourState, setTourState] = React.useState<TourState>(() => {
    const steps: TourStep[] = TOUR_STEPS.map((step, index) => ({
      ...step,
      isCompleted: false,
      isActive: index === 0,
    }))

    return {
      currentStep: 0,
      steps,
      isActive: false,
      hasStarted: false,
    }
  })

  const nextStep = React.useCallback((): void => {
    setTourState((prev) => {
      if (prev.currentStep >= prev.steps.length - 1) return prev

      const newCurrentStep = prev.currentStep + 1
      const updatedSteps = prev.steps.map((step, index) => ({
        ...step,
        isActive: index === newCurrentStep,
        isCompleted: index < newCurrentStep ? true : step.isCompleted,
      }))

      return {
        ...prev,
        currentStep: newCurrentStep,
        steps: updatedSteps,
      }
    })
  }, [])

  const previousStep = React.useCallback((): void => {
    setTourState((prev) => {
      if (prev.currentStep <= 0) return prev

      const newCurrentStep = prev.currentStep - 1
      const updatedSteps = prev.steps.map((step, index) => ({
        ...step,
        isActive: index === newCurrentStep,
      }))

      return {
        ...prev,
        currentStep: newCurrentStep,
        steps: updatedSteps,
      }
    })
  }, [])

  const goToStep = React.useCallback((stepIndex: number): void => {
    setTourState((prev) => {
      if (stepIndex < 0 || stepIndex >= prev.steps.length) return prev

      const updatedSteps = prev.steps.map((step, index) => ({
        ...step,
        isActive: index === stepIndex,
        isCompleted: index < stepIndex ? true : step.isCompleted,
      }))

      return {
        ...prev,
        currentStep: stepIndex,
        steps: updatedSteps,
      }
    })
  }, [])

  const startTour = React.useCallback((): void => {
    setTourState((prev) => ({
      ...prev,
      isActive: true,
      hasStarted: true,
    }))
  }, [])

  const completeTour = React.useCallback((): void => {
    setTourState((prev) => {
      const updatedSteps = prev.steps.map((step) => ({
        ...step,
        isCompleted: true,
        isActive: false,
      }))

      return {
        ...prev,
        steps: updatedSteps,
        isActive: false,
      }
    })
  }, [])

  const markStepCompleted = React.useCallback((stepId: string): void => {
    setTourState((prev) => {
      const updatedSteps = prev.steps.map((step) =>
        step.id === stepId ? { ...step, isCompleted: true } : step,
      )

      return {
        ...prev,
        steps: updatedSteps,
      }
    })
  }, [])

  const value: TourContextValue = {
    tourState,
    nextStep,
    previousStep,
    goToStep,
    startTour,
    completeTour,
    markStepCompleted,
  }

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}

// Tour navigation component
export function TourNavigation(): React.JSX.Element {
  const { tourState, nextStep, previousStep, startTour, completeTour } = useTour()

  if (!tourState.hasStarted) {
    return (
      <NativeCard variant="tour" className="border-dashed">
        <SectionHeader
          title="Interactive tRPC Guide"
          subtitle="Learn tRPC concepts through hands-on examples"
        />
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground leading-relaxed">
            This guided tour will walk you through all the core tRPC patterns you'll use in
            production applications. Each step includes working examples you can interact with.
          </div>
          <NativeButton onClick={startTour} className="w-full">
            Start Interactive Guide
          </NativeButton>
        </div>
      </NativeCard>
    )
  }

  const currentStep = tourState.steps[tourState.currentStep]
  const completedSteps = tourState.steps.filter((step) => step.isCompleted).length
  const isLastStep = tourState.currentStep === tourState.steps.length - 1

  return (
    <NativeCard variant="tour">
      <div className="space-y-4">
        <ProgressBar progress={completedSteps} total={tourState.steps.length} />

        <div>
          <SectionHeader
            title={currentStep.title}
            subtitle={currentStep.description}
            badge={currentStep.concept}
          />
        </div>

        <div className="flex justify-between items-center">
          <NativeButton
            variant="outline"
            size="sm"
            onClick={previousStep}
            disabled={tourState.currentStep === 0}
          >
            Previous
          </NativeButton>

          <div className="flex gap-1">
            {tourState.steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  step.isCompleted ? 'bg-green-500' : step.isActive ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {isLastStep ? (
            <NativeButton size="sm" onClick={completeTour}>
              Complete Tour
            </NativeButton>
          ) : (
            <NativeButton size="sm" onClick={nextStep}>
              Next
            </NativeButton>
          )}
        </div>
      </div>
    </NativeCard>
  )
}
