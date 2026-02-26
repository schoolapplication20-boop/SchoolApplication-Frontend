import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/Login/Forgot password/ForgotPassword'
import ForgotOtp from './pages/Login/Forgot password/ForgotOtp'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import './pages/AuthInputConsistency.css'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/forgot-otp" element={<ForgotOtp />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  )
}

export default App
