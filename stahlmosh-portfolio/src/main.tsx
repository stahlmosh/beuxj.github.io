import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bowlby-one/400.css'
import '@fontsource/archivo/400.css'
import '@fontsource/archivo/600.css'
import '@fontsource/archivo/800.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
