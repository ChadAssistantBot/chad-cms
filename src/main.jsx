import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#111c31',
            color: '#eef4ff',
            border: '1px solid rgba(148, 163, 184, 0.18)',
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
