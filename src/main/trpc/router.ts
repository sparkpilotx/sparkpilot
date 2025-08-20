import { createTRPCRouter } from './trpc'
import { helloTrpcRouter } from './routers/hello-trpc'
import { preferencesRouter } from './routers/preferences'
import { appearanceRouter } from './routers/appearance'

export const appRouter = createTRPCRouter({
  helloTrpc: helloTrpcRouter,
  preferences: preferencesRouter,
  appearance: appearanceRouter,
})

export type AppRouter = typeof appRouter
