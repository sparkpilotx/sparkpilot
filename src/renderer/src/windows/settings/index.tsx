import React from 'react'
import { WindowChrome } from '@/components/window/window-chrome'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppearance } from '@/providers/appearance'
import type { ThemeSource } from '@shared/appearance'

type SettingsProps = {}
const Settings = ({}: SettingsProps): React.JSX.Element => {
  const { themeSource, setThemeSource } = useAppearance()

  return (
    <div className="flex h-screen flex-col">
      <WindowChrome
        title={import.meta.env.VITE_APP_NAME}
        subTitle="Settings"
        shortDescription="Application configuration"
      />
      <main className="flex-1 overflow-auto">
        <div className="min-h-full p-6">
          <section className="mx-auto w-full max-w-xl space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Appearance</h2>
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="theme-source">Theme</Label>
                  <p className="text-xs text-muted-foreground">
                    Choose light, dark, or follow system.
                  </p>
                </div>
                <Select
                  value={themeSource}
                  onValueChange={(value: ThemeSource) => setThemeSource(value)}
                >
                  <SelectTrigger
                    id="theme-source"
                    size="default"
                    aria-label="Theme"
                    className="min-w-36"
                  >
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Settings
