import React from 'react'
import { WindowChrome } from '@/components/window/window-chrome'

type HelloWorldProps = {}
const HelloWorld = ({}: HelloWorldProps): React.JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      <WindowChrome
        title="SparkPilot • Hello World"
        subTitle="Simple demonstration window"
        shortDescription="v1.0.0"
      />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">Hello World content will go here</div>
      </main>
    </div>
  )
}

export default HelloWorld
