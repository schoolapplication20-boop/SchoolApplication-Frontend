import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { isSchoolSetupCompleted } from '../../utils/adminSetupStorage'

const Dashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSchoolSetupCompleted()) {
      navigate('/admin-setup')
    }
  }, [navigate])

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>Welcome to Schoolers</h1>
        <p>You are logged in successfully.</p>
      </div>
    </div>
  )
}

export default Dashboard
