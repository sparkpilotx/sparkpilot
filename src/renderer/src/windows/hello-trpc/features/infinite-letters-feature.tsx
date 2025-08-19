import React from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import { NativeCard, SectionHeader, StatusIndicator, NativeButton } from '../ui-components'
import { useTour } from '../tour-system'

export function InfiniteLettersFeature(): React.JSX.Element {
  const { markStepCompleted } = useTour()
  const queryClient = useQueryClient()

  const lettersQuery = useInfiniteQuery(
    trpc.helloTrpc.letters.infiniteQueryOptions(undefined, {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }),
  )

  const [hasInteracted, setHasInteracted] = React.useState(false)

  // Mark step as completed when user fetches more data
  React.useEffect(() => {
    if (hasInteracted && lettersQuery.data && lettersQuery.data.pages.length > 1) {
      markStepCompleted('infinite')
    }
  }, [hasInteracted, lettersQuery.data, markStepCompleted])

  const handleLoadMore = React.useCallback((): void => {
    setHasInteracted(true)
    void lettersQuery.fetchNextPage()
  }, [lettersQuery])

  const handleReset = React.useCallback((): void => {
    // Reset infinite query by removing cached data and refetching from the beginning
    const queryKey = trpc.helloTrpc.letters.queryKey()
    queryClient.removeQueries({ queryKey })
    void lettersQuery.refetch()
  }, [lettersQuery, queryClient])

  const allLetters = lettersQuery.data?.pages.flatMap((page) => page.items) ?? []
  const hasNextPage = lettersQuery.hasNextPage
  const isFetchingNextPage = lettersQuery.isFetchingNextPage

  const getStatusInfo = (): {
    status: 'idle' | 'loading' | 'success' | 'error'
    message: string
  } => {
    if (lettersQuery.isLoading) {
      return { status: 'loading', message: 'Loading initial letters' }
    }
    if (lettersQuery.error) {
      return { status: 'error', message: `Load failed: ${lettersQuery.error.message}` }
    }
    if (allLetters.length > 0) {
      const pagesLoaded = lettersQuery.data?.pages.length ?? 0
      return {
        status: 'success',
        message: `${allLetters.length} letters loaded (${pagesLoaded} pages)`,
      }
    }
    return { status: 'idle', message: 'Ready to load letters' }
  }

  const { status, message } = getStatusInfo()

  return (
    <NativeCard variant="feature">
      <SectionHeader
        title="Alphabet Pagination"
        subtitle="Infinite scroll with cursor-based pagination"
        badge="Infinite Query"
      />

      <div className="space-y-4">
        <div className="rounded-lg bg-muted/30 p-4 border border-muted">
          <div className="flex items-center justify-between mb-3">
            <StatusIndicator status={status}>{message}</StatusIndicator>

            <div className="flex gap-2">
              <NativeButton
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={lettersQuery.isLoading}
              >
                Reset
              </NativeButton>

              {hasNextPage && (
                <NativeButton
                  size="sm"
                  onClick={handleLoadMore}
                  isLoading={isFetchingNextPage}
                  disabled={!hasNextPage}
                >
                  Load More
                </NativeButton>
              )}
            </div>
          </div>

          {allLetters.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {allLetters.map((letter, index) => (
                  <div
                    key={`${letter}-${index}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 font-mono font-semibold text-primary"
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                {!hasNextPage && allLetters.length > 0 && (
                  <span className="text-primary">✓ All letters loaded</span>
                )}
                {hasNextPage && <span>More letters available...</span>}
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong>Concept:</strong> This uses{' '}
          <code className="text-foreground bg-muted px-1 rounded">
            trpc.helloTrpc.letters.infiniteQueryOptions()
          </code>
          with <code className="text-foreground bg-muted px-1 rounded">useInfiniteQuery</code> for
          cursor-based pagination. Each page is cached independently, enabling efficient infinite
          scroll patterns.
        </div>
      </div>
    </NativeCard>
  )
}
