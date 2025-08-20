import { BrowserWindow, Menu, nativeTheme } from 'electron/main'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import type { WindowDescriptor, WindowId, WindowModule } from './window-types'
import { is, optimizer } from '@electron-toolkit/utils'

import { windowModule as settingsModule } from './windows/settings'
import { windowModule as helloWorldModule } from './windows/hello-world'
import { windowModule as helloStylingModule } from './windows/hello-styling'
import { windowModule as helloTrpcModule } from './windows/hello-trpc'

/**
 * Central window manager: typed registry, single-instance control, and tray menu.
 * No default window; all windows are created on-demand via tray.
 */

const modules = new Map<WindowId, WindowModule>([
  ['settings', settingsModule],
  ['hello-world', helloWorldModule],
  ['hello-styling', helloStylingModule],
  ['hello-trpc', helloTrpcModule],
])

export const registerWindowModule = (id: WindowId, mod: WindowModule): void => {
  modules.set(id, mod)
}

const getDescriptor = (id: WindowId): WindowDescriptor | undefined => {
  return modules.get(id)?.descriptor
}

const singletonWindows = new Map<WindowId, BrowserWindow>()

export const resolvePreloadPath = (): string => {
  // Preload bundle is CommonJS to support sandboxed renderers
  const cjsUrl = new URL('../preload/index.cjs', import.meta.url)
  const jsUrl = new URL('../preload/index.js', import.meta.url)
  const cjsPath = fileURLToPath(cjsUrl)
  if (existsSync(cjsPath)) return cjsPath
  return fileURLToPath(jsUrl)
}

export const getRendererUrlFor = (descriptor: WindowDescriptor): string => {
  // Use dev server URL in development, else file URL to built index.html
  const baseUrl = process.env.ELECTRON_RENDERER_URL
  if (is.dev && baseUrl) {
    const u = new URL(baseUrl)
    u.searchParams.set('win', descriptor.id)
    if (descriptor.route) u.hash = descriptor.route
    return u.toString()
  }
  const fileUrl = new URL('../renderer/index.html', import.meta.url)
  const u = new URL(fileUrl.toString())
  u.searchParams.set('win', descriptor.id)
  if (descriptor.route) u.hash = descriptor.route
  return u.toString()
}

const createBrowserWindow = (descriptor: WindowDescriptor): BrowserWindow => {
  const win = new BrowserWindow({
    title: descriptor.title,
    width: descriptor.width,
    height: descriptor.height,
    minWidth: descriptor.minWidth,
    minHeight: descriptor.minHeight,
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0f0f0f' : '#ffffff',
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: resolvePreloadPath(),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: is.dev,
    },
  })

  const mod = modules.get(descriptor.id)!
  // Improve developer ergonomics (F12 devtools in dev, ignore reload in prod)
  optimizer.watchWindowShortcuts(win)
  mod.onBeforeLoad?.(win)

  const url = getRendererUrlFor(descriptor)
  win.loadURL(url).catch(() => {})

  win.once('ready-to-show', () => {
    if (!win.isDestroyed()) win.show()
    mod.onReady?.(win)
  })

  win.on('closed', () => {
    if (descriptor.singleInstance) singletonWindows.delete(descriptor.id)
    mod.onClosed?.()
  })

  return win
}

export const openWindow = (id: WindowId): BrowserWindow => {
  const descriptor = getDescriptor(id)
  if (!descriptor) throw new Error(`Unknown window id: ${id}`)

  if (descriptor.singleInstance) {
    const existing = singletonWindows.get(id)
    if (existing && !existing.isDestroyed()) {
      if (existing.isMinimized()) existing.restore()
      existing.focus()
      return existing
    }
    const win = createBrowserWindow(descriptor)
    singletonWindows.set(id, win)
    return win
  }
  return createBrowserWindow(descriptor)
}

export const focusWindow = (id: WindowId): boolean => {
  const descriptor = getDescriptor(id)
  if (!descriptor) return false
  const existing = singletonWindows.get(id)
  if (existing && !existing.isDestroyed()) {
    if (existing.isMinimized()) existing.restore()
    existing.focus()
    return true
  }
  return false
}

export const getRegisteredWindows = (): readonly WindowDescriptor[] =>
  Array.from(modules.values()).map((m) => m.descriptor)

export const buildWindowsTrayMenu = (): Electron.Menu => {
  const template: Electron.MenuItemConstructorOptions[] = []
  for (const descriptor of getRegisteredWindows()) {
    template.push({ label: descriptor.menuLabel, click: () => openWindow(descriptor.id) })
  }
  template.push({ type: 'separator' })
  template.push({ label: 'Quit', role: 'quit' })
  return Menu.buildFromTemplate(template)
}
