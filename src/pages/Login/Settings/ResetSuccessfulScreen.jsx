import React from 'react'
import './ResetSuccessfulScreen.css'

const ResetSuccessfulScreen = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div className="rss-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-success-title">
      <div className="rss-card">
        <h3 id="reset-success-title" className="rss-title">Reset Successful</h3>
        <p className="rss-text">You're good to go.</p>
        <button type="button" className="rss-button" onClick={onClose}>
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default ResetSuccessfulScreen
