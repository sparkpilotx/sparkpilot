import type { WindowModule } from '../../window-types'

export const windowModule: WindowModule = {
  descriptor: {
    id: 'settings',
    title: 'SparkPilot • Settings',
    menuLabel: 'Settings',
    singleInstance: true,
    width: 760,
    height: 600,
    minWidth: 600,
    minHeight: 440,
  },
}
