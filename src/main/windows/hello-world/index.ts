import type { WindowModule } from '../../window-types'

export const windowModule: WindowModule = {
  descriptor: {
    id: 'hello-world',
    title: 'SparkPilot • Hello World',
    menuLabel: 'Hello World',
    singleInstance: true,
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
  },
}
