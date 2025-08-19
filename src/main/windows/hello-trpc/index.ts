import type { WindowModule } from '../../window-types'

export const windowModule: WindowModule = {
  descriptor: {
    id: 'hello-trpc',
    title: 'SparkPilot • Hello TRPC',
    menuLabel: 'Hello TRPC',
    singleInstance: true,
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
  },
}
