import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DataProvider } from './contexts/DataContext'
import { InteractionProvider } from './contexts/InteractionContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <InteractionProvider>
        <App />
      </InteractionProvider>
    </DataProvider>
  </StrictMode>,
)
