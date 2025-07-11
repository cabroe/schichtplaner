import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@tabler/core/dist/css/tabler.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'
import '@tabler/core/dist/js/tabler.min.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
