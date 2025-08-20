import * as React from 'react'
import type { ThemeSource } from '@shared/appearance'
import { trpcClient, trpcProxy } from '@/lib/trpc'

type AppearanceContextValue = {
  isDarkMode: boolean
  themeSource: ThemeSource
  setThemeSource: (next: ThemeSource) => void
}

const getSystemPrefersDark = (): boolean => {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

const applyDocumentTheme = (isDarkMode: boolean): void => {
  document.documentElement.classList.toggle('dark', isDarkMode)
  try {
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light'
  } catch {}
}

const defaultValue: AppearanceContextValue = {
  isDarkMode: getSystemPrefersDark(),
  themeSource: 'system',
  setThemeSource: () => {},
}

const AppearanceContext = React.createContext<AppearanceContextValue>(defaultValue)

export const AppearanceProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element => {
  const [state, setState] = React.useState<AppearanceContextValue>(defaultValue)

  // Apply initial theme synchronously for first paint consistency
  React.useLayoutEffect(() => {
    applyDocumentTheme(state.isDarkMode)
  }, [])

  React.useEffect(() => {
    let unsubscribe: (() => void) | null = null
    ;(async () => {
      // 1) Load persisted theme source via tRPC
      try {
        const persisted = await trpcProxy.preferences.getThemeSource.query()
        const persistedSource = persisted.themeSource as ThemeSource
        setState((prev) => ({ ...prev, themeSource: persistedSource }))
        // Apply optimistic theme locally to minimize visual changes
        const optimisticIsDark =
          persistedSource === 'dark'
            ? true
            : persistedSource === 'light'
              ? false
              : getSystemPrefersDark()
        applyDocumentTheme(optimisticIsDark)
        // 2) Inform main process to adopt the selected theme source via tRPC
        await trpcProxy.appearance.setThemeSource.mutate({ themeSource: persistedSource })
      } catch {}

      // 3) Fetch current snapshot from main (tRPC) and subscribe to future changes via SSE
      const curr = await trpcProxy.appearance.getSnapshot.query()
      setState((prev) => {
        const next = { ...prev, isDarkMode: curr.isDarkMode, themeSource: curr.themeSource }
        applyDocumentTheme(next.isDarkMode)
        return next
      })
      const sub = trpcClient.appearance.onChanged.subscribe(undefined, {
        onData: (next: { isDarkMode: boolean; themeSource: ThemeSource }) => {
          setState((prev) => {
            const merged = { ...prev, isDarkMode: next.isDarkMode, themeSource: next.themeSource }
            applyDocumentTheme(merged.isDarkMode)
            return merged
          })
        },
        onError: () => {},
      })
      unsubscribe = () => sub.unsubscribe()
    })()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const setThemeSource = React.useCallback((next: ThemeSource) => {
    const optimisticIsDark =
      next === 'dark' ? true : next === 'light' ? false : getSystemPrefersDark()
    applyDocumentTheme(optimisticIsDark)
    setState((prev) => ({ ...prev, themeSource: next, isDarkMode: optimisticIsDark }))
    // Persist via tRPC, then update main themeSource via tRPC
    void trpcProxy.preferences.setThemeSource
      .mutate({ themeSource: next })
      .then(async () => {
        await trpcProxy.appearance.setThemeSource.mutate({ themeSource: next })
      })
      .catch(() => {})
  }, [])

  const value = React.useMemo<AppearanceContextValue>(
    () => ({ isDarkMode: state.isDarkMode, themeSource: state.themeSource, setThemeSource }),
    [state.isDarkMode, state.themeSource, setThemeSource],
  )

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}

export const useAppearance = (): AppearanceContextValue => {
  return React.useContext(AppearanceContext)
}

export const useIsDarkMode = (): boolean => {
  return React.useContext(AppearanceContext).isDarkMode
}
