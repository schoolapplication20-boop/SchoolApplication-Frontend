import React, { useState } from 'react'
import './ForgotPassword.css'
import forgotImg from '../../../assets/images/forgot.png'
import otpIcon from '../../../assets/images/otp.png'
import { Link, useNavigate } from 'react-router-dom'
import { DUMMY_RESET_CREDENTIALS, getStoredCredentials } from '../../../utils/authStorage'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [error, setError] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const mobileRegex = /^[0-9]{10}$/
  const registeredDummyUsernames = new Set(
    DUMMY_RESET_CREDENTIALS.map((cred) => (cred.username || '').trim().toLowerCase()).filter(Boolean),
  )

  const handleIdentifierChange = (e) => {
    let value = e.target.value
    if (/^\d*$/.test(value)) value = value.slice(0, 10)
    setIdentifier(value)
    setError('')
  }

  const handleSendOTP = () => {
    const rawIdentifier = identifier.trim()
    const normalizedIdentifier = rawIdentifier.toLowerCase()

    if (!rawIdentifier) {
      setError('Please enter username, email or mobile number')
      return
    }

    const isEmail = normalizedIdentifier.includes('@')
    if (isEmail) {
      if (!emailRegex.test(normalizedIdentifier)) {
        setError('Please enter a valid email address')
        return
      }
      navigate('/forgot-otp', { state: { email: normalizedIdentifier, identifier: normalizedIdentifier } })
      return
    }

    if (/^\d+$/.test(rawIdentifier)) {
      if (!mobileRegex.test(rawIdentifier)) {
        setError('Mobile number must be exactly 10 digits')
        return
      }
      navigate('/forgot-otp', { state: { mobileNumber: rawIdentifier, identifier: rawIdentifier } })
      return
    }

    const storedUsername = (getStoredCredentials().username || '').trim().toLowerCase()
    if (!registeredDummyUsernames.has(normalizedIdentifier) && normalizedIdentifier !== storedUsername) {
      setError('Please enter a registered username, email or mobile number')
      return
    }

    navigate('/forgot-otp', { state: { identifier: normalizedIdentifier } })
  }

  return (
    <div className="container-fluid forgot-page">
      <div className="row g-0 min-vh-100">
        <div className="col-12 col-lg-6 forgot-left d-flex flex-column p-4 p-lg-5 text-white">
          <div className="branding d-flex align-items-center mb-3">
            <div className="schoolers-logo">🏆</div>
            <h1 className="ms-3 schoolers-title">Schoolers</h1>
          </div>

          <div className="tagline mt-3">
            <h2>Speed Up Your Work Flow</h2>
            <h2>With Our Web App</h2>
          </div>

          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="forgot-illustration">
              <img src={forgotImg} alt="Forgot Illustration" />
            </div>
          </div>

          <div className="footer-text text-center small mt-3">Digital It & Media Solutions Pvt Ltd</div>
        </div>

        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
          <div className="forgot-card p-4 p-md-5 w-100">
            <div className="mb-3">
              <Link to="/" className="btn btn-outline-secondary btn-sm">&larr; Back to Login</Link>
            </div>
            <div className="text-center mb-3 otp-icon">
              <img src={otpIcon} alt="otp icon" />
            </div>
            <h3 className="mb-2">Verify Identity</h3>
            <p className="text-muted">Enter your registered username, email or mobile number</p>

            <label className="form-label mt-3">Username, Email or Mobile Number</label>
            <input
              type="text"
              className="form-control form-control-lg mb-3"
              placeholder="Enter Username, Email or Mobile"
              value={identifier}
              onChange={handleIdentifierChange}
            />
            {error && <div className="text-danger small mb-3">{error}</div>}

            <button className="btn send-otp-btn btn-lg w-100" onClick={handleSendOTP}>
              Send OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
