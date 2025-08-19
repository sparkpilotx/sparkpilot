import React from 'react'
import { WindowChrome } from '@/components/ui/window-chrome'

type SettingsProps = {}
const Settings = ({}: SettingsProps): React.JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      <WindowChrome title="SparkPilot • Settings" />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">Settings content will go here</div>
      </main>
    </div>
  )
}

export default Settings
