import React from 'react'

type HelloStylingProps = {}
const HelloStyling = ({}: HelloStylingProps): React.JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      <div className="app-region-drag flex items-center justify-between gap-2 border-b bg-background/70 pl-20 pr-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="text-xs text-muted-foreground">SparkPilot • Hello Styling</div>
      </div>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">Hello Styling content will go here</div>
      </main>
    </div>
  )
}

export default HelloStyling
