import React, { useMemo } from 'react'

import HelloWorld from '@/windows/hello-world'
import HelloStyling from '@/windows/hello-styling'
import Settings from '@/windows/settings'

const App = (): React.JSX.Element => {
  const currentWindow = useMemo(() => new URLSearchParams(window.location.search).get('win'), [])

  if (currentWindow === 'hello-world') return <HelloWorld />
  if (currentWindow === 'hello-styling') return <HelloStyling />
  if (currentWindow === 'settings') return <Settings />

  return (
    <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
      Unknown window.
    </div>
  )
}

export default App
