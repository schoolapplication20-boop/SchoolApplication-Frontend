import React, { useState } from 'react'
import './ResetPassword.css'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const ResetPassword = () => {
	const [previousPassword, setPreviousPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword((prev) => !prev)
	}

	const handleMouseDownConfirmPassword = (e) => {
		e.preventDefault()
	}

	const handleMouseUpConfirmPassword = (e) => {
		e.preventDefault()
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		setError('')
		setSuccess('')

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

		// Replace this with real API call to update password.
		setTimeout(() => {
			setSuccess('Password has been reset successfully.')
			setPreviousPassword('')
			setNewPassword('')
			setConfirmPassword('')
		}, 600)
	}

	return (
		<div className="rp-page">
			<aside className="rp-hero">
				<div className="rp-hero-inner">
					<div className="rp-brand">
						<div className="rp-logo">🏆</div>
						<h1>Schoolers</h1>
					</div>
					<p className="rp-tag">Speed Up Your Work Flow <br></br>
                        With Our Web App</p>
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
						onClick={handleClickShowConfirmPassword}
						onMouseDown={handleMouseDownConfirmPassword}
						onMouseUp={handleMouseUpConfirmPassword}
					>
						{showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
					</button>
				</div>
				<div className="rp-helper-text">
					Min 8 chars, include uppercase, lowercase, number and special character
				</div>
			</label>

			{error && <div className="rp-error">{error}</div>}
			{success && <div className="rp-success">{success}</div>}

						<button className="rp-button" type="submit">
							Reset password
						</button>
					</form>
				</div>
			</main>
		</div>
	)
}

export default ResetPassword
