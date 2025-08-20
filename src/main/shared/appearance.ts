import z from 'zod'

export type ThemeSource = 'system' | 'light' | 'dark'
export const ThemeSourceSchema = z.enum(['system', 'light', 'dark'])

export const AppearanceSnapshotSchema = z.object({
  isDarkMode: z.boolean(),
  themeSource: ThemeSourceSchema,
})
export type AppearanceSnapshot = z.infer<typeof AppearanceSnapshotSchema>
