import type { WindowModule } from '../../window-types'

export const windowModule: WindowModule = {
  descriptor: {
    id: 'settings',
    title: 'SparkPilot • Settings',
    menuLabel: 'Settings',
    singleInstance: true,
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
  },
}
