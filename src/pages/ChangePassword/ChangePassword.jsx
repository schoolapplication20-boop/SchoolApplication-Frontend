import React, { useState } from 'react'
import './ChangePassword.css'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import changePasswordImg from '../../assets/images/forgot.png'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const ChangePassword = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleChangePassword = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Check for password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, number and special character')
      return
    }

    const email = (location.state?.email || '').trim().toLowerCase()
    const identifier = (location.state?.identifier || '').trim().toLowerCase()

    // Keep reset password aligned with email login key used in Login.jsx.
    const loginAccountKey = email || 'admin@gmail.com'
    localStorage.setItem(`schoolers_password_${loginAccountKey}`, formData.password)

    // Also update identifier key when present to avoid breaking existing local demo data.
    if (identifier && identifier !== loginAccountKey) {
      localStorage.setItem(`schoolers_password_${identifier}`, formData.password)
    }

    alert('Password changed successfully!')
    navigate('/')
  }

  return (
    <div className="container-fluid change-password-page">
      <div className="row g-0 min-vh-100">
        {/* Left Side */}
        <div className="col-12 col-lg-6 change-password-left d-flex flex-column p-4 p-lg-5 text-white">
          <div className="branding d-flex align-items-center mb-3">
            <div className="schoolers-logo">🏆</div>
            <h1 className="ms-3 schoolers-title">Schoolers</h1>
          </div>

          <div className="tagline mt-3">
            <h2>Speed Up Your Work Flow</h2>
            <h2>With Our Web App</h2>
          </div>

          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="change-password-illustration">
              <img src={changePasswordImg} alt="Change Password Illustration" />
            </div>
          </div>

          <div className="footer-text text-center small mt-3">Digital It & Media Solutions Pvt Ltd</div>
        </div>

        {/* Right Side */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
          <div className="change-password-card p-4 p-md-5 w-100">
            <div className="mb-3">
              <Link to="/forgot" className="btn btn-outline-secondary btn-sm">&larr; Back</Link>
            </div>

            <h3 className="mb-2 text-center">Set New Password</h3>
            <p className="text-muted text-center mb-4">Create a strong password for your account</p>

            {/* New Password Field */}
            <label className="form-label">New Password</label>
            <div className="password-field no-toggle mb-3">
              <input
                type="password"
                className="form-control form-control-lg change-password-input"
                placeholder="Enter New Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <small className="text-muted d-block mb-3">
              Min 8 chars, include uppercase, lowercase, number and special character
            </small>

            {/* Confirm Password Field */}
            <label className="form-label">Confirm Password</label>
            <div className="password-field mb-3">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control form-control-lg change-password-input"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                className="password-toggle-btn"
                type="button"
                aria-label="Toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            {error && <div className="alert alert-danger text-center mb-3">{error}</div>}

            {/* Change Password Button */}
            <button className="btn change-password-btn btn-lg w-100" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
