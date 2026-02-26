import React, { useState, useRef } from 'react'
import './ForgotOtp.css'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import forgotImg from '../../../assets/images/forgot.png'

const ForgotOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const mobileNumber = location.state?.mobileNumber || ''
  const email = location.state?.email || ''
  const identifier = mobileNumber || email

  const [otp, setOtp] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const otpRefs = [useRef(), useRef(), useRef(), useRef()]

  const DUMMY_OTP = '1234'

  const handleOtpChange = (index, value) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1) // Take only first digit

    setOtp(newOtp)
    setError('')

    // Auto-move to next input if digit entered
    if (value && index < 3) {
      otpRefs[index + 1].current.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      otpRefs[index - 1].current.focus()
    }
  }

  const handleResendOtp = () => {
    setOtp(['', '', '', ''])
    setError('')
    otpRefs[0].current.focus()
    alert(`New OTP sent successfully (Dummy OTP: ${DUMMY_OTP})`)
  }

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('')

    if (!enteredOtp || enteredOtp.length !== 4) {
      setError('Please enter all 4 digits')
      return
    }

    if (enteredOtp === DUMMY_OTP) {
      alert('OTP Verified Successfully')
      navigate('/change-password', { state: { mobileNumber, email, identifier } })
    } else {
      setError('Invalid OTP. Please try again.')
      setOtp(['', '', '', ''])
      otpRefs[0].current.focus()
    }
  }

  return (
    <div className="container-fluid forgot-otp-page">
      <div className="row g-0 min-vh-100">
        {/* Left Side */}
        <div className="col-12 col-lg-6 forgot-otp-left d-flex flex-column p-4 p-lg-5 text-white">
          <div className="branding d-flex align-items-center mb-3">
            <div className="schoolers-logo">🏆</div>
            <h1 className="ms-3 schoolers-title">Schoolers</h1>
          </div>

          <div className="tagline mt-3">
            <h2>Speed Up Your Work Flow</h2>
            <h2>With Our Web App</h2>
          </div>

          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="forgot-otp-illustration">
              <img src={forgotImg} alt="Forgot Illustration" />
            </div>
          </div>

          <div className="footer-text text-center small mt-3">Digital It & Media Solutions Pvt Ltd</div>
        </div>

        {/* Right Side */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
          <div className="forgot-otp-card p-4 p-md-5 w-100">
            <div className="mb-3">
              <Link to="/forgot" className="btn btn-outline-secondary btn-sm">&larr; Back</Link>
            </div>

            <h3 className="mb-2 text-center">Enter OTP</h3>
            <p className="text-muted text-center mb-4">Please Enter Your OTP To Continue</p>

            {/* OTP Input Fields */}
            <div className="otp-input-container d-flex justify-content-center gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder={index + 1}
                  inputMode="numeric"
                  maxLength="1"
                />
              ))}
            </div>

            {error && <div className="alert alert-danger text-center mb-3">{error}</div>}

            {/* Resend OTP Link */}
            <div className="text-center mb-4">
              <button className="btn btn-link p-0 resend-otp-btn" onClick={handleResendOtp}>
                Resend OTP
              </button>
            </div>

            {/* Verify Button */}
            <button className="btn verify-otp-btn btn-lg w-100" onClick={handleVerifyOtp}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotOtp
