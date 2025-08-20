import { nativeTheme } from 'electron/main'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { AppearanceSnapshotSchema, ThemeSourceSchema } from '@shared/appearance'

const getSnapshot = (): { isDarkMode: boolean; themeSource: 'system' | 'light' | 'dark' } => {
  const raw = {
    isDarkMode: Boolean(nativeTheme.shouldUseDarkColors),
    themeSource: (nativeTheme.themeSource ?? 'system') as 'system' | 'light' | 'dark',
  }
  return AppearanceSnapshotSchema.parse(raw)
}

export const appearanceRouter = createTRPCRouter({
  getSnapshot: publicProcedure.query(
    async (): Promise<ReturnType<typeof getSnapshot>> => getSnapshot(),
  ),
  setThemeSource: publicProcedure
    .input(z.object({ themeSource: ThemeSourceSchema }))
    .mutation(async ({ input }): Promise<ReturnType<typeof getSnapshot>> => {
      nativeTheme.themeSource = input.themeSource
      return getSnapshot()
    }),
  onChanged: publicProcedure.subscription(async function* ({
    signal,
  }): AsyncGenerator<ReturnType<typeof getSnapshot>, void, unknown> {
    // Emit initial snapshot
    yield getSnapshot()

    // Loop and yield on each nativeTheme update until aborted
    const abortSignal: AbortSignal = (signal ?? new AbortController().signal) as AbortSignal
    while (!abortSignal.aborted) {
      await new Promise<void>((resolve) => {
        const handler = (): void => {
          nativeTheme.off('updated', handler)
          resolve()
        }
        nativeTheme.on('updated', handler)
        abortSignal.addEventListener(
          'abort',
          () => {
            nativeTheme.off('updated', handler)
            resolve()
          },
          { once: true },
        )
      })
      if (abortSignal.aborted) break
      yield getSnapshot()
    }
  }),
})
