import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/Login/Forgot password/ForgotPassword'
import ForgotOtp from './pages/Login/Forgot password/ForgotOtp'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import './pages/AuthInputConsistency.css'
import ResetPassword from './pages/Login/Settings/ResetPassword'
import Dashboard from './pages/Dashboard/Dashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/forgot-otp" element={<ForgotOtp />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
