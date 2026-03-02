import React from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
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
