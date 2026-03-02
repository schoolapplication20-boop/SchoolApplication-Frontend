import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import './AdminSetup.css'
import { getSchoolSetupData, saveSchoolSetupData } from '../../utils/adminSetupStorage'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 80 }, (_, index) => String(currentYear - index))

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
  country: 'India',
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
    admin: true,
    teacher: false,
    staff: false,
  },
  currency: 'INR (₹)',
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
const currencies = ['INR (₹)']
const mediums = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi', 'Bengali', 'Gujarati']
const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'NIOS']
const workingDaysOptions = ['-None-', 'Monday - Friday', 'Monday - Saturday']
const timeZones = ['IST (UTC+05:30)']
const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']

const AdminSetup = () => {
  const navigate = useNavigate()
  const storedData = useMemo(() => getSchoolSetupData(), [])
  const [formData, setFormData] = useState(() => ({
    ...defaultFormData,
    ...storedData,
    userRoles: {
      ...defaultFormData.userRoles,
      ...(storedData?.userRoles || {}),
    },
  }))
  const [error, setError] = useState('')

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
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

  const handleSave = () => {
    if (!formData.schoolName || !formData.address || !formData.city || !formData.state || !formData.emailId) {
      setError('Please fill the required school and contact details before saving.')
      return
    }

    saveSchoolSetupData(formData)
    navigate('/dashboard')
  }

  return (
    <div className="admin-setup-page">
      <div className="admin-setup-shell">
        <header className="setup-header">
          <div>
            <h1>Setup School</h1>
            <p>Enter your school information to get started</p>
          </div>
          <button type="button" className="save-btn" onClick={handleSave}>Save</button>
        </header>

        <section className="setup-card">
          <h2 className="section-title">
            <SchoolOutlinedIcon fontSize="small" />
            <span>School Information</span>
          </h2>
          <div className="school-grid">
            <div className="left-grid">
              <label>School Name<input value={formData.schoolName} onChange={(e) => setField('schoolName', e.target.value)} placeholder="Enter School Name" /></label>
              <label>School Type<input value={formData.schoolType} onChange={(e) => setField('schoolType', e.target.value)} placeholder="Enter School Type" /></label>
              <label>School Code/Reg No.<input value={formData.schoolCode} onChange={(e) => setField('schoolCode', e.target.value)} placeholder="Enter Code" /></label>
              <label>
                Established Year
                <select value={formData.establishedYear} onChange={(e) => setField('establishedYear', e.target.value)}>
                  <option value="">Enter Year</option>
                  {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
            </div>

            <div className="logo-box">
              <h3>Upload Logo</h3>
              <div className="logo-preview">
                {formData.logoDataUrl ? <img src={formData.logoDataUrl} alt="School Logo" /> : <span>↑</span>}
              </div>
              <label className="upload-btn">
                Upload
                <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
              </label>
              {formData.logoFileName ? <small>{formData.logoFileName}</small> : null}
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
              <label>Address<input value={formData.address} onChange={(e) => setField('address', e.target.value)} placeholder="Enter Address" /></label>
            </div>
            <div className="contact-inline-row">
              <span className="inline-label">City</span>
              <input value={formData.city} onChange={(e) => setField('city', e.target.value)} placeholder="Enter City" />
              <span className="inline-label">State</span>
              <select value={formData.state} onChange={(e) => setField('state', e.target.value)}>
                {states.map((state) => <option key={state} value={state === '-State-' ? '' : state}>{state}</option>)}
              </select>
              <span className="inline-label">Pincode</span>
              <input value={formData.pincode} onChange={(e) => setField('pincode', e.target.value)} placeholder="-Pincode-" />
            </div>
            <div className="fields-grid one-col">
              <label>Country<input value={formData.country} onChange={(e) => setField('country', e.target.value)} placeholder="Enter Country Name" /></label>
              <label>Phone Number<input value={formData.phoneNumber} onChange={(e) => setField('phoneNumber', e.target.value)} placeholder="Enter phone number" /></label>
              <label>Email ID<input value={formData.emailId} onChange={(e) => setField('emailId', e.target.value)} placeholder="Enter Email" /></label>
              <label>Website<input value={formData.website} onChange={(e) => setField('website', e.target.value)} placeholder="Enter URL" /></label>
            </div>
          </div>
        </section>

        <section className="setup-card">
          <h2 className="section-title">
            <AdminPanelSettingsOutlinedIcon fontSize="small" />
            <span>Administration Details</span>
          </h2>
          <div className="fields-grid two-col">
            <label>Principal Name<input value={formData.principalName} onChange={(e) => setField('principalName', e.target.value)} placeholder="Enter Principal Name" /></label>
            <label>
              Medium
              <select value={formData.medium} onChange={(e) => setField('medium', e.target.value)}>
                <option value="">Enter Medium</option>
                {mediums.map((medium) => <option key={medium} value={medium}>{medium}</option>)}
              </select>
            </label>
            <label>Headmaster Name<input value={formData.headmasterName} onChange={(e) => setField('headmasterName', e.target.value)} placeholder="Enter HM Name" /></label>
            <label>
              Board
              <select value={formData.board} onChange={(e) => setField('board', e.target.value)}>
                <option value="">Enter Board</option>
                {boards.map((board) => <option key={board} value={board}>{board}</option>)}
              </select>
            </label>
            <label>Authorized Person<input value={formData.authorizedPerson} onChange={(e) => setField('authorizedPerson', e.target.value)} placeholder="Enter Name" /></label>
            <label>
              Working Days
              <select value={formData.workingDays} onChange={(e) => setField('workingDays', e.target.value)}>
                {workingDaysOptions.map((days) => <option key={days} value={days === '-None-' ? '' : days}>{days}</option>)}
              </select>
            </label>
            <label>Contact Number<input value={formData.contactNumber} onChange={(e) => setField('contactNumber', e.target.value)} placeholder="Enter Mobile No" /></label>
            <label>
              School Timings
              <input
                value={formData.schoolTimings}
                onChange={(e) => setField('schoolTimings', e.target.value)}
                placeholder="Enter School Timings"
              />
            </label>
          </div>
        </section>

        <div className="bottom-grid">
          <section className="setup-card compact">
            <h2 className="section-title">
              <SettingsOutlinedIcon fontSize="small" />
              <span>System Details</span>
            </h2>
            <div className="fields-grid one-col">
              <label>Language<input value={formData.language} onChange={(e) => setField('language', e.target.value)} placeholder="Enter Language" /></label>
              <label>
                Time Zone
                <select value={formData.timeZone} onChange={(e) => setField('timeZone', e.target.value)}>
                  <option value="">Enter TimeZone</option>
                  {timeZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
                </select>
              </label>
              <label>
                Date Format
                <select value={formData.dateFormat} onChange={(e) => setField('dateFormat', e.target.value)}>
                  <option value="">DD/MM/YYYY</option>
                  {dateFormats.map((format) => <option key={format} value={format}>{format}</option>)}
                </select>
              </label>
              <div className="roles-row">
                <span className="roles-title">User Roles</span>
                <div className="roles-options">
                  <label><input type="checkbox" checked={formData.userRoles.admin} onChange={(e) => setRole('admin', e.target.checked)} /> Admin</label>
                  <label><input type="checkbox" checked={formData.userRoles.teacher} onChange={(e) => setRole('teacher', e.target.checked)} /> Teacher</label>
                  <label><input type="checkbox" checked={formData.userRoles.staff} onChange={(e) => setRole('staff', e.target.checked)} /> Staff</label>
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
              <label>
                Currency
                <select value={formData.currency} onChange={(e) => setField('currency', e.target.value)}>
                  {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                </select>
              </label>
              <label>Bank Account<textarea value={formData.bankAccount} onChange={(e) => setField('bankAccount', e.target.value)} placeholder="Bank:ABC Bank&#10;Account No:1234567890" rows={3} /></label>
              <label>Tax / GST Number<input value={formData.taxGstNumber} onChange={(e) => setField('taxGstNumber', e.target.value)} placeholder="GST12345678" /></label>
            </div>
          </section>
        </div>

        {error ? <div className="setup-error">{error}</div> : null}
      </div>
    </div>
  )
}

export default AdminSetup
