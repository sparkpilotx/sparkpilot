import React from 'react'
import { WindowChrome } from '@/components/window/window-chrome'

type HelloWorldProps = {}
const HelloWorld = ({}: HelloWorldProps): React.JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      <WindowChrome
        title={import.meta.env.VITE_APP_NAME}
        subTitle="Hello World"
        shortDescription="Simple demonstration window"
      />
      <main className="flex-1 overflow-auto">
        <div className="flex items-center justify-center min-h-full p-6">
          <div className="text-sm text-muted-foreground">Hello World content will go here</div>
        </div>
      </main>
    </div>
  )
}

export default HelloWorld
