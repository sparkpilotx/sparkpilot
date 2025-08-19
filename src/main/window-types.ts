export type WindowId = 'settings' | 'hello-world' | 'hello-styling' | 'hello-trpc'

export type WindowDescriptor = {
  id: WindowId
  title: string
  menuLabel: string
  singleInstance: boolean
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  /** Optional initial hash or path. Prefer query param `win` for routing. */
  route?: string
}

export interface WindowModule {
  descriptor: WindowDescriptor
  onBeforeLoad?: (win: Electron.BrowserWindow) => void
  onReady?: (win: Electron.BrowserWindow) => void
  onClosed?: () => void
}
