import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { getActiveLoginUser, getPostLoginRoute } from '../../utils/adminSetupStorage'
import { getStoredCredentials } from '../../utils/authStorage'

const Dashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const setupUserKey = getActiveLoginUser() || (getStoredCredentials().username || '').trim().toLowerCase()
    const nextRoute = getPostLoginRoute(setupUserKey)
    if (nextRoute !== '/dashboard') navigate(nextRoute)
  }, [navigate])

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>Welcome to Schoolers</h1>
        <p>You are logged in successfully.</p>
        {/* <Link to="/" className="dashboard-link">Back to Login</Link> */}
      </div>
    </div>
  )
}

export default Dashboard
