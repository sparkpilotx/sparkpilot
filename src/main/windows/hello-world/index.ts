import type { WindowModule } from '../../window-types'

export const windowModule: WindowModule = {
  descriptor: {
    id: 'hello-world',
    title: 'SparkPilot • Hello World',
    menuLabel: 'Hello World',
    singleInstance: true,
    width: 640,
    height: 480,
    minWidth: 480,
    minHeight: 360,
  },
}
