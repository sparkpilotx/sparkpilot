import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import {
  CardWrapper,
  SectionHeader,
  InputWrapper,
  ButtonWrapper,
  StatusIndicator,
} from '../ui-components'
import { useTour } from '../tour-system'

export function EchoMutationFeature(): React.JSX.Element {
  const { markStepCompleted } = useTour()
  const [text, setText] = React.useState('')
  const [inputError, setInputError] = React.useState('')

  const echoMutation = useMutation(
    trpc.helloTrpc.echo.mutationOptions({
      onSuccess: () => {
        markStepCompleted('mutations')
        setInputError('')
      },
      onError: (error) => {
        setInputError(error.message)
      },
    }),
  )

  const handleSubmit = React.useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault()

      if (!text.trim()) {
        setInputError('Please enter some text to echo')
        return
      }

      if (text.trim().length < 2) {
        setInputError('Text must be at least 2 characters long')
        return
      }

      echoMutation.mutate({ text: text.trim() })
    },
    [text, echoMutation],
  )

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setText(e.target.value)
      if (inputError) setInputError('')
    },
    [inputError],
  )

  const getStatusInfo = (): {
    status: 'idle' | 'loading' | 'success' | 'error'
    message: string
  } => {
    if (echoMutation.isPending) {
      return { status: 'loading', message: 'Processing echo request' }
    }
    if (echoMutation.error) {
      return { status: 'error', message: `Mutation failed: ${echoMutation.error.message}` }
    }
    if (echoMutation.data) {
      return { status: 'success', message: 'Echo completed successfully' }
    }
    return { status: 'idle', message: 'Ready to echo your text' }
  }

  const { status, message } = getStatusInfo()

  return (
    <CardWrapper variant="feature">
      <SectionHeader
        title="Echo Mutation"
        subtitle="Server-side data transformation using tRPC's mutationOptions"
        badge="Mutation"
      />

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputWrapper
            label="Text to Echo"
            placeholder="Type something to transform..."
            value={text}
            onChange={handleInputChange}
            error={inputError}
            disabled={echoMutation.isPending}
          />

          <ButtonWrapper
            type="submit"
            className="w-full"
            isLoading={echoMutation.isPending}
            disabled={!text.trim() || !!inputError}
          >
            {echoMutation.isPending ? 'Echoing...' : 'Echo Text'}
          </ButtonWrapper>
        </form>

        <div className="rounded-lg bg-muted/30 p-4 border border-muted">
          <div className="flex items-center justify-between mb-3">
            <StatusIndicator status={status}>{message}</StatusIndicator>
          </div>

          {echoMutation.data && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Server Response:</div>
              <div className="font-mono text-lg text-primary font-semibold">
                {echoMutation.data.echoed}
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong>Concept:</strong> This uses{' '}
          <code className="text-foreground bg-muted px-1 rounded">
            trpc.helloTrpc.echo.mutationOptions()
          </code>
          with TanStack Query's{' '}
          <code className="text-foreground bg-muted px-1 rounded">useMutation</code> hook. Mutations
          handle server state changes with automatic error handling and optimistic updates.
        </div>
      </div>
    </CardWrapper>
  )
}
