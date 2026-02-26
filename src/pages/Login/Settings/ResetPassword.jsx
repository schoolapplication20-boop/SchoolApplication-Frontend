import React, { useEffect, useState } from 'react'
import './ResetPassword.css'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { getStoredCredentials, markPasswordResetSkipped, saveNewPassword } from '../../../utils/authStorage'
import ResetSuccessfulScreen from './ResetSuccessfulScreen'
import { useLocation, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isFromDefaultLogin = Boolean(location.state?.fromDefaultLogin)
  const [previousPassword, setPreviousPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setShowSuccessPopup(false)
    const storedCredentials = getStoredCredentials()

    if (!previousPassword || !newPassword || !confirmPassword) {
      setError('Please fill out all fields.')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (newPassword === previousPassword) {
      setError('Password must not be same as previous password. Please enter a different password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    if (previousPassword !== storedCredentials.password) {
      setError('Previous password is incorrect.')
      return
    }

    setTimeout(() => {
      saveNewPassword(newPassword)
      setShowSuccessPopup(true)
      setPreviousPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 600)
  }

  const handleSkip = () => {
    markPasswordResetSkipped()
    navigate('/dashboard')
  }

  useEffect(() => {
    if (!showSuccessPopup) return undefined
    const timer = setTimeout(() => {
      setShowSuccessPopup(false)
      navigate('/')
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate, showSuccessPopup])

  return (
    <div className="rp-page">
      <aside className="rp-hero">
        <div className="rp-hero-inner">
          <div className="rp-brand">
            <div className="rp-logo">🏆</div>
            <h1>Schoolers</h1>
          </div>
          <p className="rp-tag">Speed Up Your Work Flow <br />With Our Web App</p>
          <div className="rp-illustration">
            <img src="/src/assets/images/resetpassword.png" alt="Reset Password" />
          </div>
          <div className="rp-footer">Digital It & Media Solutions Pvt Ltd</div>
        </div>
      </aside>

      <main className="rp-card">
        <div className="rp-card-inner">
          <h2 className="rp-title">Reset your password</h2>

          <form className="rp-form" onSubmit={handleSubmit}>
            <label className="rp-label">
              Previous password
              <input
                type="text"
                value={previousPassword}
                onChange={(e) => setPreviousPassword(e.target.value)}
                placeholder="Previous password"
                className="rp-input"
              />
            </label>

            <label className="rp-label">
              New password
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="rp-input"
              />
            </label>

            <label className="rp-label">
              Confirm password
              <div className="rp-password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="rp-input"
                />
                <button
                  type="button"
                  className="rp-eye-icon"
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>
              <div className="rp-helper-text">
                Min 8 chars, include uppercase, lowercase, number and special character
              </div>
            </label>

            {error && <div className="rp-error">{error}</div>}
            <div className="rp-actions">
              <button className="rp-button" type="submit">Reset password</button>
              {isFromDefaultLogin && (
                <button type="button" className="rp-skip-button" onClick={handleSkip}>Skip for now</button>
              )}
            </div>
          </form>
        </div>
      </main>

      <ResetSuccessfulScreen
        open={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false)
          navigate('/')
        }}
      />
    </div>
  )
}

export default ResetPassword
