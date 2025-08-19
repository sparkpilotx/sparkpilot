import React from 'react'
import { WindowChrome } from '@/components/ui/window-chrome'

type HelloStylingProps = {}
const HelloStyling = ({}: HelloStylingProps): React.JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      <WindowChrome title="SparkPilot • Hello Styling" />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">Hello Styling content will go here</div>
      </main>
    </div>
  )
}

export default HelloStyling
