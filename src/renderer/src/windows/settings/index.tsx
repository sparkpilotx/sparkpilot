import React from 'react'
import { WindowChrome } from '@/components/window/window-chrome'

type SettingsProps = {}
const Settings = ({}: SettingsProps): React.JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      <WindowChrome
        title={import.meta.env.VITE_APP_NAME}
        subTitle="Settings"
        shortDescription="Application configuration"
      />
      <main className="flex-1 overflow-auto">
        <div className="flex items-center justify-center min-h-full p-6">
          <div className="text-sm text-muted-foreground">Settings content will go here</div>
        </div>
      </main>
    </div>
  )
}

export default Settings
