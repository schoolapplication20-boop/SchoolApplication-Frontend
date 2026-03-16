import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import './AdminSetup.css'
import { saveSchoolSetupData, getActiveLoginUser, getPostLoginRoute } from '../../utils/adminSetupStorage'
import { getStoredCredentials } from '../../utils/authStorage'
import { cities, countries } from '../../utils/locationOptions'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 80 }, (_, index) => String(currentYear - index))
const schoolTypeOptions = ['Government School', 'Private School', 'Aided School', 'International School']

const defaultFormData = {
  schoolName: '',
  schoolType: '',
  schoolCode: '',
  establishedYear: '',
  logoDataUrl: '',
  logoFileName: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  phoneNumber: '',
  emailId: '',
  website: '',
  principalName: '',
  headmasterName: '',
  authorizedPerson: '',
  contactNumber: '',
  medium: '',
  board: '',
  workingDays: '',
  schoolTimings: '',
  language: '',
  timeZone: '',
  dateFormat: '',
  userRoles: {
    admin: false,
    teacher: false,
    staff: false,
  },
  currency: '',
  bankBranch: '',
  accountNumber: '',
  ifscCode: '',
  bankAccount: '',
  taxGstNumber: '',
}

const states = [
  '-State-',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]
const currencies = ['INR (Rs)']
const mediums = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi', 'Bengali', 'Gujarati']
const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'NIOS']
const workingDaysOptions = ['-None-', 'Monday - Friday', 'Monday - Saturday']
const timeZones = ['IST (UTC+05:30)']
const languageOptions = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Urdu']
const schoolTimingOptions = [
  '08:00 AM - 02:00 PM',
  '08:30 AM - 03:00 PM',
  '09:00 AM - 03:30 PM',
  '09:00 AM - 04:00 PM',
  '09:00 AM - 05:00 PM',
  '09:00 AM - 06:00 PM'
]
const bankBranchOptions = [
  { id: 'sbi-hyd-abids', bank: 'State Bank of India', branch: 'Abids, Hyderabad', ifsc: 'SBIN0000802' },
  { id: 'sbi-vja-benzcircle', bank: 'State Bank of India', branch: 'Benz Circle, Vijayawada', ifsc: 'SBIN0001450' },
  { id: 'hdfc-hyd-jubilee', bank: 'HDFC Bank', branch: 'Jubilee Hills, Hyderabad', ifsc: 'HDFC0000470' },
  { id: 'hdfc-vizag-mvp', bank: 'HDFC Bank', branch: 'MVP Colony, Visakhapatnam', ifsc: 'HDFC0002404' },
  { id: 'icici-hyd-kukatpally', bank: 'ICICI Bank', branch: 'Kukatpally, Hyderabad', ifsc: 'ICIC0001956' },
  { id: 'icici-guntur-lakshmipuram', bank: 'ICICI Bank', branch: 'Lakshmipuram, Guntur', ifsc: 'ICIC0001694' },
  { id: 'axis-hyd-himayatnagar', bank: 'Axis Bank', branch: 'Himayatnagar, Hyderabad', ifsc: 'UTIB0000022' },
  { id: 'axis-nellore-magunta', bank: 'Axis Bank', branch: 'Magunta Layout, Nellore', ifsc: 'UTIB0002013' },
  { id: 'pnb-hyd-secunderabad', bank: 'Punjab National Bank', branch: 'Secunderabad', ifsc: 'PUNB0108500' },
  { id: 'canara-tirupati-main', bank: 'Canara Bank', branch: 'Main Branch, Tirupati', ifsc: 'CNRB0000808' },
]

const FieldRowContext = createContext({
  getFieldId: () => undefined,
  renderFieldError: () => null,
})

const FieldRow = ({ label, errorKey, children }) => {
  const { getFieldId, renderFieldError } = useContext(FieldRowContext)
  const fieldId = errorKey ? getFieldId(errorKey) : undefined
  return (
    <div className="form-field">
      <label className="field-label" htmlFor={fieldId}>{label}</label>
      <div className="field-control">
        {children}
        {renderFieldError(errorKey)}
      </div>
    </div>
  )
}

const AdminSetup = () => {
  const FORM_INVALID_MESSAGE = 'Fill the details properly'
  const navigate = useNavigate()

  const [formData, setFormData] = useState(() => ({
    ...defaultFormData,
    userRoles: {
      ...defaultFormData.userRoles,
    },
  }))
  const [error, setError] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [nextRouteAfterSave, setNextRouteAfterSave] = useState('/teachers-profile')
  const [touchedFields, setTouchedFields] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  const markTouched = (key) => {
    if (!key) return
    setTouchedFields((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
  }

  const handleBankBranchChange = (value) => {
    const selectedBankBranch = bankBranchOptions.find((option) => option.id === value)
    setFormData((prev) => ({
      ...prev,
      bankBranch: value,
      ifscCode: selectedBankBranch?.ifsc || '',
    }))
    markTouched('bankBranch')
    setError('')
  }

  const setRole = (key, checked) => {
    setFormData((prev) => ({
      ...prev,
      userRoles: {
        ...prev.userRoles,
        [key]: checked,
      },
    }))
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    markTouched('logoDataUrl')
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        logoDataUrl: reader.result || '',
        logoFileName: file.name,
      }))
    }
    reader.readAsDataURL(file)
  }

  const formValidation = (() => {
    const phoneNumber = (formData.phoneNumber || '').trim()
    const contactNumber = (formData.contactNumber || '').trim()
    const emailId = (formData.emailId || '').trim().toLowerCase()
    const pincode = (formData.pincode || '').replace(/\D/g, '')
    const schoolName = (formData.schoolName || '').trim()
    const schoolType = (formData.schoolType || '').trim()
    const schoolCode = (formData.schoolCode || '').trim()
    const establishedYear = (formData.establishedYear || '').trim()
    const logoDataUrl = (formData.logoDataUrl || '').trim()
    const address = (formData.address || '').trim()
    const city = (formData.city || '').trim()
    const state = (formData.state || '').trim()
    const country = (formData.country || '').trim()
    const website = (formData.website || '').trim()
    const principalName = (formData.principalName || '').trim()
    const headmasterName = (formData.headmasterName || '').trim()
    const authorizedPerson = (formData.authorizedPerson || '').trim()
    const medium = (formData.medium || '').trim()
    const board = (formData.board || '').trim()
    const workingDays = (formData.workingDays || '').trim()
    const schoolTimings = (formData.schoolTimings || '').trim()
    const language = (formData.language || '').trim()
    const timeZone = (formData.timeZone || '').trim()
    const currency = (formData.currency || '').trim()
    const bankBranch = (formData.bankBranch || '').trim()
    const accountNumber = (formData.accountNumber || '').replace(/\D/g, '')
    const ifscCode = (formData.ifscCode || '').trim().toUpperCase()
    const taxGstNumber = (formData.taxGstNumber || '').trim().toUpperCase()

    const missingFieldErrors = {}
    if (!schoolName) missingFieldErrors.schoolName = 'School Name is required'
    if (!schoolType) missingFieldErrors.schoolType = 'School Type is required'
    if (!schoolCode) missingFieldErrors.schoolCode = 'School Code is required'
    if (!establishedYear) missingFieldErrors.establishedYear = 'Established Year is required'
    if (!logoDataUrl) missingFieldErrors.logoDataUrl = 'School Logo is required'
    if (!address) missingFieldErrors.address = 'Address is required'
    if (!city) missingFieldErrors.city = 'City is required'
    if (!state) missingFieldErrors.state = 'State is required'
    if (!pincode) missingFieldErrors.pincode = 'Pincode is required'
    if (!country) missingFieldErrors.country = 'Country is required'
    if (!phoneNumber) missingFieldErrors.phoneNumber = 'Phone Number is required'
    if (!emailId) missingFieldErrors.emailId = 'Email ID is required'
    if (!principalName) missingFieldErrors.principalName = 'Principal Name is required'
    if (!headmasterName) missingFieldErrors.headmasterName = 'Headmaster Name is required'
    if (!authorizedPerson) missingFieldErrors.authorizedPerson = 'Authorized Person is required'
    if (!contactNumber) missingFieldErrors.contactNumber = 'Contact Number is required'
    if (!medium) missingFieldErrors.medium = 'Medium is required'
    if (!board) missingFieldErrors.board = 'Board is required'
    if (!workingDays) missingFieldErrors.workingDays = 'Working Days are required'
    if (!schoolTimings) missingFieldErrors.schoolTimings = 'School Timings are required'
    if (!language) missingFieldErrors.language = 'Language is required'
    if (!timeZone) missingFieldErrors.timeZone = 'Time Zone is required'

    const fieldErrors = { ...missingFieldErrors }

    if (phoneNumber && !/^[0-9]{10}$/.test(phoneNumber)) fieldErrors.phoneNumber = 'Phone Number must be 10 digits'
    if (contactNumber && !/^[0-9]{10}$/.test(contactNumber)) fieldErrors.contactNumber = 'Contact Number must be 10 digits'
    if (emailId && !/^[a-z0-9._%+-]+@gmail\.com$/.test(emailId)) fieldErrors.emailId = 'Email must be valid @gmail.com'
    if (pincode && !/^[0-9]{6}$/.test(pincode)) fieldErrors.pincode = 'Pincode must be 6 digits'
    if (accountNumber && !/^[0-9]{9,18}$/.test(accountNumber)) fieldErrors.accountNumber = 'Account Number must be 9 to 18 digits'
    if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) fieldErrors.ifscCode = 'IFSC format is invalid'
    if (taxGstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(taxGstNumber)) {
      fieldErrors.taxGstNumber = 'GSTIN format is invalid'
    }

    const selectedBankBranch = bankBranchOptions.find((option) => option.id === bankBranch)
    if (bankBranch && (!selectedBankBranch || ifscCode !== selectedBankBranch.ifsc)) {
      fieldErrors.bankBranch = 'Bank branch and IFSC must match'
      fieldErrors.ifscCode = 'Bank branch and IFSC must match'
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        isComplete: Object.keys(missingFieldErrors).length === 0,
        isValid: false,
        fieldErrors,
      }
    }

    const bankAccountSummary = (bankBranch && accountNumber && ifscCode && selectedBankBranch)
      ? `Bank Name: ${selectedBankBranch.bank}`
        + ` (${selectedBankBranch.branch})`
        + `\nAccount Number: ${accountNumber}`
        + `\nIFSC Code: ${ifscCode}`
      : ''

    return {
      isComplete: Object.keys(missingFieldErrors).length === 0,
      isValid: true,
      normalized: {
        schoolName,
        schoolType,
        schoolCode,
        establishedYear,
        address,
        city,
        state,
        pincode,
        country,
        phoneNumber,
        emailId,
        website,
        principalName,
        headmasterName,
        authorizedPerson,
        contactNumber,
        medium,
        board,
        workingDays,
        schoolTimings,
        language,
        timeZone,
        currency,
        bankBranch,
        accountNumber,
        ifscCode,
        taxGstNumber,
      },
      fieldErrors,
      bankAccountSummary,
    }
  })()

  const getFieldId = (key) => `setup-field-${key}`

  const shouldShowError = (key) => Boolean(formValidation.fieldErrors?.[key]) && (touchedFields[key] || hasSubmitted)

  const getFieldErrorId = (key) => `setup-error-${key}`

  const getFieldProps = (key) => {
    const showError = shouldShowError(key)
    return {
      id: getFieldId(key),
      className: showError ? 'field-invalid' : '',
      'aria-invalid': showError ? 'true' : 'false',
      'aria-describedby': showError ? getFieldErrorId(key) : undefined,
      onBlur: () => markTouched(key),
    }
  }

  const renderFieldError = (key, extraClass = '') => {
    if (!key || !shouldShowError(key)) return null
    const className = ['field-error', extraClass].filter(Boolean).join(' ')
    return (
      <div className={className} id={getFieldErrorId(key)} role="alert">
        <WarningAmberRoundedIcon fontSize="small" />
        <span>{formValidation.fieldErrors[key]}</span>
      </div>
    )
  }

  const hasVisibleErrors = Object.keys(formValidation.fieldErrors || {}).some((key) => shouldShowError(key))

  const handleSave = () => {
    setHasSubmitted(true)
    if (!formValidation.isValid) {
      setError(FORM_INVALID_MESSAGE)
      return
    }

    const setupUserKey = getActiveLoginUser() || (getStoredCredentials().username || '').trim().toLowerCase()
    const isSaved = saveSchoolSetupData({
      ...formData,
      ...(formValidation.normalized || {}),
      bankAccount: formValidation.bankAccountSummary || '',
    }, setupUserKey)
    if (!isSaved) {
      setError('Unable to save setup details. Please try again.')
      return
    }

    setNextRouteAfterSave(getPostLoginRoute(setupUserKey))
    setError('')
    setShowSuccessPopup(true)
  }

  const handleAdminJump = () => {
    const section = document.getElementById('admin-details')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (!showSuccessPopup) return undefined
    const timer = setTimeout(() => {
      navigate(nextRouteAfterSave)
    }, 1200)
    return () => clearTimeout(timer)
  }, [navigate, showSuccessPopup, nextRouteAfterSave])

  return (
    <FieldRowContext.Provider value={{ getFieldId, renderFieldError }}>
      <div className="admin-setup-page">
        <div className="admin-setup-shell">
        <header className="setup-header">
          <div>
            <h1>Setup School</h1>
            <p>Enter your school information to get started</p>
          </div>
          <div className="setup-header-actions">
            <button type="button" className="admin-btn" onClick={handleAdminJump}> Add Admin</button>
            <button type="button" className="save-btn" onClick={handleSave} disabled={!formValidation.isComplete}>Save</button>
          </div>
        </header>

        {hasVisibleErrors ? (
          <div className="setup-validation-hint">
            <WarningAmberRoundedIcon fontSize="small" />
            <span>Please fill highlighted fields properly.</span>
          </div>
        ) : null}

        <section className="setup-card" id="admin-details">
          <h2 className="section-title">
            <SchoolOutlinedIcon fontSize="small" />
            <span>School Information</span>
          </h2>
          <div className="school-grid">
            <div className="left-grid">
              <FieldRow label="School Name" errorKey="schoolName">
                <input {...getFieldProps('schoolName')} value={formData.schoolName} onChange={(e) => setField('schoolName', e.target.value)} placeholder="Enter School Name" />
              </FieldRow>
              <FieldRow label="School Type" errorKey="schoolType">
                <select {...getFieldProps('schoolType')} value={formData.schoolType} onChange={(e) => setField('schoolType', e.target.value)}>
                  <option value="">Select School Type</option>
                  {schoolTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="School Code/Reg No." errorKey="schoolCode">
                <input {...getFieldProps('schoolCode')} value={formData.schoolCode} onChange={(e) => setField('schoolCode', e.target.value)} placeholder="Enter Code" />
              </FieldRow>
              <FieldRow label="Established Year" errorKey="establishedYear">
                <select {...getFieldProps('establishedYear')} value={formData.establishedYear} onChange={(e) => setField('establishedYear', e.target.value)}>
                  <option value="">Enter Year</option>
                  {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </FieldRow>
            </div>

            <div className={`logo-box ${shouldShowError('logoDataUrl') ? 'field-invalid-box' : ''}`}>
              <h3>Upload Logo</h3>
              <div className="logo-preview">
                {formData.logoDataUrl ? <img src={formData.logoDataUrl} alt="School Logo" /> : <span className="logo-placeholder">&uarr;</span>}
              </div>
              {renderFieldError('logoDataUrl', 'logo-error')}
              <label className="upload-btn">
                Upload
                <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
              </label>
              {formData.logoFileName ? <small className="logo-file-name">{formData.logoFileName}</small> : null}
            </div>
          </div>
        </section>

        <section className="setup-card">
          <h2 className="section-title">
            <LocationOnOutlinedIcon fontSize="small" />
            <span>Contact Details</span>
          </h2>
          <div className="contact-details-stack">
            <div className="fields-grid one-col">
              <FieldRow label="Address" errorKey="address">
                <input {...getFieldProps('address')} value={formData.address} onChange={(e) => setField('address', e.target.value)} placeholder="Enter Address" />
              </FieldRow>
            </div>
            <div className="fields-grid three-col">
              <FieldRow label="City" errorKey="city">
                <select {...getFieldProps('city')} value={formData.city} onChange={(e) => setField('city', e.target.value)}>
                  <option value="">Enter City</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="State" errorKey="state">
                <select {...getFieldProps('state')} value={formData.state} onChange={(e) => setField('state', e.target.value)}>
                  {states.map((state) => <option key={state} value={state === '-State-' ? '' : state}>{state}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Pincode" errorKey="pincode">
                <input {...getFieldProps('pincode')} value={formData.pincode} onChange={(e) => setField('pincode', e.target.value)} placeholder="-Pincode-" />
              </FieldRow>
            </div>
            <div className="fields-grid one-col">
              <FieldRow label="Country" errorKey="country">
                <select {...getFieldProps('country')} value={formData.country} onChange={(e) => setField('country', e.target.value)}>
                  <option value="">Enter Country</option>
                  {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Phone Number" errorKey="phoneNumber">
                <input
                  {...getFieldProps('phoneNumber')}
                  value={formData.phoneNumber}
                  onChange={(e) => setField('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10 digit phone number"
                  inputMode="numeric"
                  maxLength={10}
                />
              </FieldRow>
              <FieldRow label="Email ID" errorKey="emailId">
                <input
                  {...getFieldProps('emailId')}
                  value={formData.emailId}
                  onChange={(e) => setField('emailId', e.target.value.replace(/\s/g, '').toLowerCase())}
                  placeholder="example@gmail.com"
                />
              </FieldRow>
              <FieldRow label="Website" errorKey="website">
                <input {...getFieldProps('website')} value={formData.website} onChange={(e) => setField('website', e.target.value)} placeholder="Enter URL" />
              </FieldRow>
            </div>
          </div>
        </section>

        <section className="setup-card">
          <h2 className="section-title">
            <AdminPanelSettingsOutlinedIcon fontSize="small" />
            <span>Administration Details</span>
          </h2>
          <div className="fields-grid two-col">
            <FieldRow label="Principal Name" errorKey="principalName">
              <input {...getFieldProps('principalName')} value={formData.principalName} onChange={(e) => setField('principalName', e.target.value)} placeholder="Enter Principal Name" />
            </FieldRow>
            <FieldRow label="Medium" errorKey="medium">
              <select {...getFieldProps('medium')} value={formData.medium} onChange={(e) => setField('medium', e.target.value)}>
                <option value="">Enter Medium</option>
                {mediums.map((medium) => <option key={medium} value={medium}>{medium}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Headmaster Name" errorKey="headmasterName">
              <input {...getFieldProps('headmasterName')} value={formData.headmasterName} onChange={(e) => setField('headmasterName', e.target.value)} placeholder="Enter HM Name" />
            </FieldRow>
            <FieldRow label="Board" errorKey="board">
              <select {...getFieldProps('board')} value={formData.board} onChange={(e) => setField('board', e.target.value)}>
                <option value="">Enter Board</option>
                {boards.map((board) => <option key={board} value={board}>{board}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Authorized Person" errorKey="authorizedPerson">
              <input {...getFieldProps('authorizedPerson')} value={formData.authorizedPerson} onChange={(e) => setField('authorizedPerson', e.target.value)} placeholder="Enter Name" />
            </FieldRow>
            <FieldRow label="Working Days" errorKey="workingDays">
              <select {...getFieldProps('workingDays')} value={formData.workingDays} onChange={(e) => setField('workingDays', e.target.value)}>
                {workingDaysOptions.map((days) => <option key={days} value={days === '-None-' ? '' : days}>{days}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Contact Number" errorKey="contactNumber">
              <input {...getFieldProps('contactNumber')} value={formData.contactNumber} onChange={(e) => setField('contactNumber', e.target.value)} placeholder="Enter Mobile No" />
            </FieldRow>
            <FieldRow label="School Timings" errorKey="schoolTimings">
              <select {...getFieldProps('schoolTimings')} value={formData.schoolTimings} onChange={(e) => setField('schoolTimings', e.target.value)}>
                <option value="">Select School Timings</option>
                {formData.schoolTimings && !schoolTimingOptions.includes(formData.schoolTimings)
                  ? <option value={formData.schoolTimings}>{formData.schoolTimings}</option>
                  : null}
                {schoolTimingOptions.map((timing) => <option key={timing} value={timing}>{timing}</option>)}
              </select>
            </FieldRow>
            </div>
          </section>

        <div className="bottom-grid">
          <section className="setup-card compact">
            <h2 className="section-title">
              <SettingsOutlinedIcon fontSize="small" />
              <span>System Details</span>
            </h2>
            <div className="fields-grid one-col">
              <FieldRow label="Language" errorKey="language">
                <select {...getFieldProps('language')} value={formData.language} onChange={(e) => setField('language', e.target.value)}>
                  <option value="">Select Language</option>
                  {formData.language && !languageOptions.includes(formData.language)
                    ? <option value={formData.language}>{formData.language}</option>
                    : null}
                  {languageOptions.map((language) => <option key={language} value={language}>{language}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Time Zone" errorKey="timeZone">
                <select {...getFieldProps('timeZone')} value={formData.timeZone} onChange={(e) => setField('timeZone', e.target.value)}>
                  <option value="">Enter TimeZone</option>
                  {timeZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
                </select>
              </FieldRow>
             
              <div className="roles-row">
                <span className="roles-title">User Roles</span>
                <div className="roles-options">
                  <label className="role-option"><input type="checkbox" checked={formData.userRoles.admin} onChange={(e) => setRole('admin', e.target.checked)} /> Admin</label>
                  <label className="role-option"><input type="checkbox" checked={formData.userRoles.teacher} onChange={(e) => setRole('teacher', e.target.checked)} /> Teacher</label>
                  <label className="role-option"><input type="checkbox" checked={formData.userRoles.staff} onChange={(e) => setRole('staff', e.target.checked)} /> Staff</label>
                </div>
              </div>
            </div>
          </section>

          <section className="setup-card compact">
            <h2 className="section-title">
              <AccountBalanceWalletOutlinedIcon fontSize="small" />
              <span>Fee & Finance</span>
            </h2>
            <div className="fields-grid one-col">
              <FieldRow label="Currency" errorKey="currency">
                <select {...getFieldProps('currency')} value={formData.currency} onChange={(e) => setField('currency', e.target.value)}>
                  <option value="">Select Currency</option>
                  {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Bank & Branch" errorKey="bankBranch">
                <select {...getFieldProps('bankBranch')} value={formData.bankBranch} onChange={(e) => handleBankBranchChange(e.target.value)}>
                  <option value="">Select Bank and Branch</option>
                  {bankBranchOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.bank} - {option.branch}
                    </option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Account Number" errorKey="accountNumber">
                <input
                  {...getFieldProps('accountNumber')}
                  value={formData.accountNumber}
                  onChange={(e) => setField('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))}
                  placeholder="Enter Account Number"
                  inputMode="numeric"
                />
              </FieldRow>
              <FieldRow label="IFSC Code" errorKey="ifscCode">
                <input
                  {...getFieldProps('ifscCode')}
                  value={formData.ifscCode}
                  onChange={(e) => setField('ifscCode', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))}
                  placeholder="Enter IFSC Code"
                />
              </FieldRow>
              <FieldRow label="Tax / GST Number" errorKey="taxGstNumber">
                <input
                  {...getFieldProps('taxGstNumber')}
                  value={formData.taxGstNumber}
                  onChange={(e) => setField('taxGstNumber', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15))}
                  placeholder="33ABCDE1234F1Z5"
                />
              </FieldRow>
            </div>
          </section>
        </div>

        {error ? (
          <div className="setup-error">
            <WarningAmberRoundedIcon fontSize="small" />
            <span>{error}</span>
          </div>
        ) : null}

        {showSuccessPopup ? (
          <div className="setup-success-overlay" role="dialog" aria-modal="true" aria-labelledby="setup-success-title">
            <div className="setup-success-card">
              <h3 id="setup-success-title">Saved Successfully</h3>
              <p>Admin setup details were saved.</p>
              <button type="button" className="setup-success-btn" onClick={() => navigate(nextRouteAfterSave)}>
                OK
              </button>
            </div>
          </div>
        ) : null}
        </div>
      </div>
    </FieldRowContext.Provider>
  )
}

export default AdminSetup
