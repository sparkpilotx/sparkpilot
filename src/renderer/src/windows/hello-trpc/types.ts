export type TourStep = {
  id: string
  title: string
  description: string
  concept: string
  order: number
  isCompleted: boolean
  isActive: boolean
}

export type TourState = {
  currentStep: number
  steps: TourStep[]
  isActive: boolean
  hasStarted: boolean
}

export type FeatureStatus = 'idle' | 'loading' | 'success' | 'error'

export type HelloTrpcFeature = {
  id: string
  title: string
  description: string
  concept: string
  status: FeatureStatus
  data?: unknown
  error?: string
}
