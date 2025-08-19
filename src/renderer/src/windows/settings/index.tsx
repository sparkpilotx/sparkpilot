import React from 'react'

type SettingsProps = {}
const Settings = ({}: SettingsProps): React.JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      <div className="app-region-drag flex items-center justify-between gap-2 border-b bg-background/70 pl-20 pr-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="text-sm font-medium text-foreground">SparkPilot • Settings</div>
      </div>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">Settings content will go here</div>
      </main>
    </div>
  )
}

export default Settings
