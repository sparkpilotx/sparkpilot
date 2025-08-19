import React from 'react'
import ReactDOM from 'react-dom/client'

import { QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/lib/trpc'

import './src/styles/globals.css'
import App from './src/App'

/**
 * Initialize the React application in the renderer process.
 *
 * Creates a React root and renders the main App component wrapped in
 * provider components for React Query, tooltips, and StrictMode for
 * development-time checks and warnings.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
