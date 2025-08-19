import type { WindowModule } from '../../window-types'

export const windowModule: WindowModule = {
  descriptor: {
    id: 'hello-trpc',
    title: 'SparkPilot • Hello TRPC',
    menuLabel: 'Hello TRPC',
    singleInstance: true,
    width: 800,
    height: 560,
    minWidth: 600,
    minHeight: 420,
  },
}
