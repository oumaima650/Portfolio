import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import AdminDashboard from './app/AdminDashboard'
import './styles/index.css'

// Route simple : /admin → dashboard, sinon portfolio
const isAdmin = window.location.pathname === '/admin';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdmin ? <AdminDashboard /> : <App />}
  </React.StrictMode>,
)
