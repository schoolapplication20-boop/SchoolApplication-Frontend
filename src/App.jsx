import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/Login/Forgot password/ForgotPassword'
import ResetPassword from './pages/Login/Settings/ResetPassword'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
    </Routes>
  )
}

export default App

