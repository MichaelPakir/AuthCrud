import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ToggleFavProvider from './contexts/ToggleFavContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToggleFavProvider>
          <App />
        </ToggleFavProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
