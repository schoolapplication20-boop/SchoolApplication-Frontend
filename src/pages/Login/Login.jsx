import React, { useEffect, useState } from 'react'
import './Login.css'
import kidsImg from '../../assets/images/kids.png'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Link } from 'react-router-dom'

const Login = () => {
  const OTP_VALIDITY_SECONDS = 45
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobileNumber: '',
    remember: false,
    role: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0)
  const [roleError, setRoleError] = useState(false)
  const [loginMode, setLoginMode] = useState('email') // 'email' or 'mobile'

  const isOtpExpired = otpSent && otpSecondsLeft === 0

  useEffect(() => {
    if (!otpSent || otpSecondsLeft <= 0) return

    const intervalId = setInterval(() => {
      setOtpSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [otpSent, otpSecondsLeft])

  const formatOtpTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
    const ss = String(seconds % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'role') setRoleError(false)
  }

  // Ensure mobile input accepts only digits and max 10 characters
  const handleMobileChange = (e) => {
    const digits = (e.target.value || '').replace(/\D/g, '').slice(0, 10)
    setFormData((p) => ({ ...p, mobileNumber: digits }))
  }

  const handleOtpInputChange = (e) => {
    const digits = (e.target.value || '').replace(/\D/g, '').slice(0, 4)
    setOtpInput(digits)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.remember) {
      alert('You must agree to the Terms & Privacy to continue')
      return
    }

    if (loginMode === 'email') {
      const email = (formData.email || '').trim()
      const pwd = formData.password || ''
      const accountKey = email.toLowerCase()
      const savedPassword = localStorage.getItem(`schoolers_password_${accountKey}`)
        if (!formData.role) {
          setRoleError(true)
          return
        }
      if (!email || !pwd) {
        alert('Please enter email and password')
        return
      }
      if (!email.includes('@gmail.com')) {
        alert('Email must be a @gmail.com address')
        return
      }
      if (savedPassword !== null) {
        if (pwd === savedPassword) {
          console.log('Submitting credentials', { email, password: pwd, role: formData.role })
          alert('Login Successful')
        } else {
          alert('Invalid Credentials')
        }
        return
      }
      if (email === 'admin@gmail.com' && pwd === 'Admin@123') {
        console.log('Submitting credentials', { email, password: pwd, role: formData.role })
        alert('Login Successful')
      } else {
        alert('Invalid Credentials')
      }
      return
    }

    // mobile mode
    const mobile = (formData.mobileNumber || '').replace(/\D/g, '')
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert('Mobile number must be exactly 10 digits')
      return
    }
    if (!otpSent) {
      alert('Please request OTP before logging in via mobile')
      return
    }
    if (!/^[0-9]{4}$/.test(otpInput)) {
      alert('Enter the 4-digit OTP')
      return
    }
    if (isOtpExpired) {
      alert('OTP expired. Please request a new OTP.')
      return
    }
    // Dummy mobile credentials: mobile 9876543210 and OTP 6744
    if (mobile === '9390417936' && otpInput === '6744') {
      alert('Login Successful')
    } else {
      alert('Invalid Credentials')
    }
  }

  const handleSendOTP = () => {
    if (otpSent && !isOtpExpired) {
      alert(`Please wait ${formatOtpTime(otpSecondsLeft)} before requesting a new OTP`)
      return
    }

    const mobile = (formData.mobileNumber || '').replace(/\D/g, '')
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert('Enter a valid 10-digit mobile number before requesting OTP')
      return
    }
    // use static OTP 6744 per requirement
    const otp = '6744'
    setOtpSent(true)
    setOtpInput('')
    setOtpSecondsLeft(OTP_VALIDITY_SECONDS)
    // since no SMS backend, show OTP in alert (for testing)
    alert(`OTP (for testing): ${otp}`)
  }

  return (
    <div className="login-container container-fluid p-0">
      <div className="row g-0 min-vh-100">
        {/* Left */}
        <div className="col-12 col-md-6 login-left-section d-flex flex-column p-5">
          <div className="login-branding d-flex align-items-center mb-3">
            <div className="schoolers-logo">🏆</div>
            <h1 className="schoolers-title ms-3">Schoolers</h1>
          </div>

          <div className="login-tagline text-white text-start mt-3">
            <h2 className="mb-2">Speed Up Your Work Flow</h2>
            <h2>With Our Web App</h2>
          </div>

          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="login-kids-image">
              <img src={kidsImg} alt="Schoolers Kids" />
            </div>
          </div>

          <div className="text-center text-white small mt-3">Digital It & Media Solutions Pvt Ltd</div>
        </div>

        {/* Right */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-4 green-bg">
          <div className="login-form-container p-4 p-md-5">
            <h2 className="login-heading">Get Started Now</h2>
            <p className="login-subheading">Please Login to Your Account To Continue</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="d-flex gap-3 mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="loginMode" id="modeEmail" value="email" checked={loginMode === 'email'} onChange={() => { setLoginMode('email'); setOtpSent(false); setOtpInput(''); }} />
                  <label className="form-check-label" htmlFor="modeEmail">Login with Email</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="loginMode" id="modeMobile" value="mobile" checked={loginMode === 'mobile'} onChange={() => { setLoginMode('mobile'); setOtpSent(false); setOtpInput(''); }} />
                  <label className="form-check-label" htmlFor="modeMobile">Login with Mobile</label>
                </div>
              </div>

              {loginMode === 'email' && (
                <>
                  <div className="mt-2">
                    <label className="input-label">Role</label>
                    <TextField
                      select
                      name="role"
                      variant="outlined"
                      value={formData.role}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      displayEmpty
                      error={roleError}
                      helperText={roleError ? 'Please select a role' : ''}
                      SelectProps={{
                        renderValue: (selected) => {
                          if (!selected) return 'Select Role'
                          return selected
                        },
                      }}
                    >
                      <MenuItem value="">Select Role</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Teacher">Teacher</MenuItem>
                      <MenuItem value="Parent">Parent</MenuItem>
                      <MenuItem value="FrontOffice">FrontOffice</MenuItem>
                    </TextField>
                  </div>
                  <label className="input-label">Email address</label>
                  <TextField
                    name="email"
                    variant="outlined"
                    placeholder="Enter Your ID"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />

                  <div className="password-row">
                    <label className="input-label">Password</label>
                    <Link to="/forgot" className="forgot-password-link">Forgot Password?</Link>
                  </div>
                  <TextField
                    name="password"
                    variant="outlined"
                    placeholder="Enter Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                    helperText="Min 8 chars, include uppercase, lowercase, number and special character"
                    FormHelperTextProps={{ className: 'password-helper' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}

              {loginMode === 'mobile' && (
                <>
                  <label className="input-label">Mobile No</label>
                  <div className="d-flex gap-2 align-items-start">
                    <TextField
                      name="mobileNumber"
                      variant="outlined"
                      placeholder="Enter Your Mobile Number"
                      value={formData.mobileNumber}
                      onChange={handleMobileChange}
                      fullWidth
                      size="small"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                    />
                    <Button variant="outlined" onClick={handleSendOTP} className="send-otp-btn" disabled={otpSent && !isOtpExpired}>
                      {otpSent && !isOtpExpired ? `Resend in ${formatOtpTime(otpSecondsLeft)}` : 'Send OTP'}
                    </Button>
                  </div>

                  {otpSent && (
                    <div className="mt-2">
                      <label className="input-label">Enter OTP</label>
                      <TextField
                        name="otp"
                        variant="outlined"
                        placeholder="1234"
                        value={otpInput}
                        onChange={handleOtpInputChange}
                        fullWidth
                        size="small"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 4 }}
                      />
                      <small className="otp-timer-text d-block mt-1">
                        {isOtpExpired ? 'OTP expired. Click Send OTP to get a new code.' : `OTP expires in ${formatOtpTime(otpSecondsLeft)}`}
                      </small>
                    </div>
                  )}

                  
                </>
              )}

              <div className="d-flex align-items-center mt-3">
                <FormControlLabel
                  control={<Checkbox name="remember" color="success" checked={formData.remember} onChange={handleChange} />}
                  label="I agree to the Terms & Privacy"
                />
              </div>

              <Button type="submit" variant="contained" fullWidth size="large" className="login-btn mt-3" disabled={!formData.remember}>
                Login
              </Button>

              {/* Social sign-in removed as requested */}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
