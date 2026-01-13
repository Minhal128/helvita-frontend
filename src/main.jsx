import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import './i18n'
import App from './App.jsx'
import { SidebarContext } from './context/SidebarContext.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xvc2UtamFndWFyLTkwLmNsZXJrLmFjY291bnRzLmRldiQ'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SidebarContext>
        <App />
      </SidebarContext>
    </ClerkProvider>
  </StrictMode>,
)
