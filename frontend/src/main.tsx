import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@tabler/core/dist/css/tabler.min.css'
import '@tabler/core/dist/js/tabler.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
