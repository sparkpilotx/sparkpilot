import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { ThemeSourceSchema } from '@shared/appearance'

export const preferencesRouter = createTRPCRouter({
  getThemeSource: publicProcedure.query(async ({ ctx }) => {
    try {
      const client = ctx.prisma as unknown as {
        preferences: {
          findUnique: (args: { where: { id: string } }) => Promise<{ themeSource: string } | null>
        }
      }
      const pref = await client.preferences.findUnique({ where: { id: 'singleton' } })
      return { themeSource: (pref?.themeSource ?? 'system') as 'system' | 'light' | 'dark' }
    } catch (_error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load themeSource' })
    }
  }),
  setThemeSource: publicProcedure
    .input(z.object({ themeSource: ThemeSourceSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        const client = ctx.prisma as unknown as {
          preferences: {
            upsert: (args: {
              where: { id: string }
              update: { themeSource: string }
              create: { id: string; themeSource: string }
            }) => Promise<unknown>
          }
        }
        await client.preferences.upsert({
          where: { id: 'singleton' },
          update: { themeSource: input.themeSource },
          create: { id: 'singleton', themeSource: input.themeSource },
        })
        return { ok: true as const }
      } catch (_error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to persist themeSource',
        })
      }
    }),
})
