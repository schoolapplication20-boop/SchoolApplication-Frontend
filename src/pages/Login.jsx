import React, { useState } from 'react';
import '../css-pages/Login.css';
import kidsImg from '../assets/images/kids.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobileNumber: '',
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Form Data:', formData);
  };

  const handleSendOTP = () => {
    console.log('OTP sent to:', formData.mobileNumber);
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left-section">
        <div className="login-branding">
          <div className="schoolers-logo">🏆</div>
          <h1 className="schoolers-title">Schoolers</h1>
        </div>
        <div className="login-tagline">
          <p>Speed Up Your Work Flow</p>
          <p>With Our Web App</p>
        </div>
        <div className="login-kids-image">
          <img src={kidsImg} alt="Schoolers Kids" />
        </div>
        <div className="login-fgooter-text">
          <p>Digital It & Media Solutions Pvt Ltd</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="login-right-section">
        <div className="login-form-container">
          <h2 className="login-heading">Get Started Now</h2>
          <p className="login-subheading">Please Login to Your Account To Continue</p>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Your ID"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="password-label-container">
                <label htmlFor="password" className="form-label">Password</label>
                <a href="#forgot-password" className="forgot-password-link">Forgot Password?</a>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <span className="eye-icon">👁️</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="divider-container">
              <span className="divider-line"></span>
              <span className="divider-text">Or</span>
              <span className="divider-line"></span>
            </div>

            {/* Mobile Number Field */}
            <div className="form-group">
              <label htmlFor="mobileNumber" className="form-label">Mobile No</label>
              <div className="mobile-input-wrapper">
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="Enter Your Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleSendOTP}
                >
                  Send OTP
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the Terms & Privacy
              </label>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
