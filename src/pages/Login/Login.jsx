import { useEffect, useState } from 'react'
import './Login.css'
import kidsImg from '../../assets/images/kids.png'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Link, useNavigate } from 'react-router-dom'
import {
  DEFAULT_PASSWORD,
  DUMMY_RESET_CREDENTIALS,
  getStoredCredentials,
  isDefaultPasswordRetired,
  setStoredCredentials,
} from '../../utils/authStorage'
import { getPostLoginRoute, setActiveLoginUser } from '../../utils/adminSetupStorage'

const OTP_VALIDITY_SECONDS = 45

const Login = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobileNumber: '',
    remember: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)
  const [loginMode, setLoginMode] = useState('username')

  const isOtpExpired = otpSent && otpTimer === 0

  useEffect(() => {
    if (!otpSent || otpTimer <= 0) return undefined

    const intervalId = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [otpSent, otpTimer])

  const formatOtpTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
    const ss = String(seconds % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  const resetOtpState = () => {
    setOtpSent(false)
    setOtpInput('')
    setOtpTimer(0)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleMobileChange = (e) => {
    const digits = (e.target.value || '').replace(/\D/g, '').slice(0, 10)
    setFormData((prev) => ({ ...prev, mobileNumber: digits }))
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

    if (loginMode === 'username') {
      const username = (formData.username || '').trim().toLowerCase()
      const pwd = formData.password || ''
      const storedCredentials = getStoredCredentials()
      const storedUsername = (storedCredentials.username || '').trim().toLowerCase()
      const savedPassword = localStorage.getItem(`schoolers_password_${username}`)

      if (!username || !pwd) {
        alert('Please enter username and password')
        return
      }

      const isDummyResetCredential = DUMMY_RESET_CREDENTIALS.some(
        (cred) => cred.username === username && cred.password === pwd,
      )

      // Let known dummy credentials always enter reset flow, even if a stale
      // per-user password is still present from an older session.
      if (isDummyResetCredential) {
        setStoredCredentials({ username, password: pwd, needsPasswordReset: true })
        localStorage.setItem(`schoolers_password_${username}`, pwd)
        navigate('/reset-password', { state: { fromDefaultLogin: true } })
        return
      }

      if (savedPassword !== null) {
        const matchesSavedPassword = pwd === savedPassword
        const matchesStoredPassword = username === storedUsername && pwd === storedCredentials.password

        if (!matchesSavedPassword && !matchesStoredPassword) {
          alert('Invalid Credentials')
          return
        }

        // Keep username password key aligned if auth storage was updated first.
        if (!matchesSavedPassword && matchesStoredPassword) {
          localStorage.setItem(`schoolers_password_${username}`, storedCredentials.password)
        }

        if (storedUsername === username && storedCredentials.needsPasswordReset) {
          navigate('/reset-password', { state: { fromDefaultLogin: true } })
        } else {
          setActiveLoginUser(username)
          navigate(getPostLoginRoute(username))
        }
        return
      }

      if (username === storedUsername && pwd === storedCredentials.password) {
        if (storedCredentials.needsPasswordReset) {
          navigate('/reset-password', { state: { fromDefaultLogin: true } })
        } else {
          setActiveLoginUser(username)
          navigate(getPostLoginRoute(username))
        }
        return
      }

      if (isDefaultPasswordRetired() && pwd === DEFAULT_PASSWORD) {
        alert('Invalid credentials')
        return
      }

      alert('Invalid Credentials')
      return
    }

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
      alert('OTP expired. Please click Send OTP again.')
      return
    }

    if (mobile === '9390417936' && otpInput === '6744') {
      const storedCredentials = getStoredCredentials()
      const activeUserFromStoredCredentials = (storedCredentials.username || '').trim().toLowerCase()
      const fallbackUser = DUMMY_RESET_CREDENTIALS[0]?.username || 'schooladmin1'
      const resolvedActiveUser = activeUserFromStoredCredentials || fallbackUser

      if (storedCredentials.needsPasswordReset) {
        navigate('/reset-password', { state: { fromDefaultLogin: true } })
        return
      }

      setActiveLoginUser(resolvedActiveUser)
      navigate(getPostLoginRoute(resolvedActiveUser))
    } else {
      alert('Invalid credentials')
    }
  }

  const handleSendOTP = () => {
    if (otpSent && !isOtpExpired) {
      alert(`Please wait ${formatOtpTime(otpTimer)} before requesting a new OTP`)
      return
    }

    const mobile = (formData.mobileNumber || '').replace(/\D/g, '')
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert('Enter a valid 10-digit mobile number before requesting OTP')
      return
    }

    setOtpSent(true)
    setOtpInput('')
    setOtpTimer(OTP_VALIDITY_SECONDS)
    alert('OTP (for testing): 6744')
  }

  return (
    <div className="login-container container-fluid p-0">
      <div className="row g-0 min-vh-100">
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

        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-4 green-bg">
          <div className="login-form-container p-4 p-md-5">
            <h2 className="login-heading">Get Started Now</h2>
            <p className="login-subheading">Please Login to Your Account To Continue</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="d-flex gap-3 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="loginMode"
                    id="modeUsername"
                    value="username"
                    checked={loginMode === 'username'}
                    onChange={() => {
                      setLoginMode('username')
                      resetOtpState()
                    }}
                  />
                  <label className="form-check-label" htmlFor="modeUsername">Login with Username</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="loginMode"
                    id="modeMobile"
                    value="mobile"
                    checked={loginMode === 'mobile'}
                    onChange={() => {
                      setLoginMode('mobile')
                      resetOtpState()
                    }}
                  />
                  <label className="form-check-label" htmlFor="modeMobile">Login with Mobile</label>
                </div>
              </div>

              {loginMode === 'username' && (
                <>
                  <label className="input-label">Username</label>
                  <TextField
                    name="username"
                    variant="outlined"
                    placeholder="Enter Username"
                    value={formData.username}
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
                    <Button
                      variant="outlined"
                      onClick={handleSendOTP}
                      className="send-otp-btn"
                      disabled={otpSent && !isOtpExpired}
                    >
                      {otpSent && !isOtpExpired ? `Resend in ${formatOtpTime(otpTimer)}` : 'Send OTP'}
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
                        {isOtpExpired ? 'OTP expired. Click Send OTP to get a new code.' : `OTP expires in ${formatOtpTime(otpTimer)}`}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
