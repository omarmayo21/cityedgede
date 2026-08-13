import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
