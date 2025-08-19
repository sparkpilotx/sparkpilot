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
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">Settings content will go here</div>
      </main>
    </div>
  )
}

export default Settings
