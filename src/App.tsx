
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import NotFound from './pages/NotFound'
import { Suspense, lazy } from 'react'

// Используем lazy loading для компонентов страниц
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Employee = lazy(() => import('./pages/Employee'))

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Загрузка...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
