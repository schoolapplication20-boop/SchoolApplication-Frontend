import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import CallOutlinedIcon from '@mui/icons-material/CallOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import './Teachersprofile.css'
import {
  getActiveLoginUser,
  getPostLoginRoute,
  isSchoolSetupCompleted,
  markTeacherProfileCompleted,
} from '../../utils/adminSetupStorage'
import { getStoredCredentials } from '../../utils/authStorage'
import { cities } from '../../utils/locationOptions'

const TEACHER_PROFILE_STORAGE_KEY = 'schoolers_teacher_profile_form'

const genders = ['Male', 'Female', 'Other']
const states = [
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

const qualifications = ['Primary', 'Secondary', 'Higher Secondary']
const subjectOptions = ['Telugu','English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Hindi']
const sanitizeExperienceDigits = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 2)
const FORM_INVALID_MESSAGE = 'Fill the details properly'

const formatBytesToKb = (sizeInBytes = 0) => `${Math.max(1, Math.round(sizeInBytes / 1024))}KB`

const toFileMeta = (file) => ({
  name: file.name,
  sizeLabel: formatBytesToKb(file.size),
  uploadedAt: new Date().toISOString(),
})

const createPreviousExperience = (id, withSampleValues = false) => ({
  id,
  schoolName: '',
  fromDate: withSampleValues ? '2020-07-15' : '',
  toDate: withSampleValues ? '2023-09-12' : '',
  resumeFile: withSampleValues
    ? { name: 'certificate_scl.pdf', sizeLabel: '150KB', uploadedAt: '2024-01-10T00:00:00.000Z' }
    : null,
})

const getDefaultFormData = () => ({
  teacherId: '',
  fullName: '',
  staffId: '',
  gender: '',
  profilePhotoDataUrl: '',
  profilePhotoName: '',
  mobileNo: '',
  emailId: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  qualification: 'Primary',
  subjectsTaught: ['Maths', 'Physics'],
  subjectExperiences: { Maths: '3', Physics: '' },
  experienceYears: '3',
  experienceTrack: '',
  joiningDate: '2024-04-15',
  joiningAcademicYear: '2024',
  aadhaarId: '1234-5678-XXXX',
  idProofFile: { name: 'aadhaar_card.pdf', sizeLabel: '45KB', uploadedAt: '2024-01-10T00:00:00.000Z' },
  teacherResumeFile: { name: 'Resume_ramesh.pdf', sizeLabel: '120KB', uploadedAt: '2024-01-10T00:00:00.000Z' },
  previousExperiences: [createPreviousExperience(1, true)],
})

const normalizeLoadedData = (storedData = {}) => {
  const base = getDefaultFormData()
  const merged = {
    ...base,
    ...storedData,
    previousExperiences: Array.isArray(storedData.previousExperiences)
      ? storedData.previousExperiences.map((experience, index) => ({
          ...createPreviousExperience(index + 1),
          ...experience,
          id: experience?.id || index + 1,
        }))
      : base.previousExperiences,
  }

  if (!merged.previousExperiences.length) {
    merged.previousExperiences = [createPreviousExperience(1)]
  }

  const normalizedSubjects = Array.isArray(merged.subjectsTaught)
    ? merged.subjectsTaught.map((subject) => String(subject).trim()).filter(Boolean)
    : String(merged.subjectsTaught || '')
      .split(',')
      .map((subject) => subject.trim())
      .filter(Boolean)

  merged.subjectsTaught = normalizedSubjects
  const rawSubjectExperiences = merged.subjectExperiences && typeof merged.subjectExperiences === 'object'
    ? merged.subjectExperiences
    : {}
  const normalizedSubjectExperiences = normalizedSubjects.reduce((acc, subject) => {
    const normalizedValue = sanitizeExperienceDigits(rawSubjectExperiences[subject] || '')
    acc[subject] = normalizedValue
    return acc
  }, {})

  if (merged.experienceTrack && normalizedSubjects.includes(merged.experienceTrack) && !normalizedSubjectExperiences[merged.experienceTrack]) {
    normalizedSubjectExperiences[merged.experienceTrack] = sanitizeExperienceDigits(merged.experienceYears || '')
  }

  merged.subjectExperiences = normalizedSubjectExperiences
  const totalExperienceYears = normalizedSubjects.reduce(
    (total, subject) => total + (Number.parseInt(normalizedSubjectExperiences[subject] || '0', 10) || 0),
    0,
  )
  merged.experienceYears = totalExperienceYears ? String(totalExperienceYears) : ''
  merged.experienceTrack = normalizedSubjects.find((subject) => normalizedSubjectExperiences[subject]) || ''

  return merged
}

const getInitialPageState = () => {
  try {
    const raw = localStorage.getItem(TEACHER_PROFILE_STORAGE_KEY)
    if (!raw) {
      return {
        formData: getDefaultFormData(),
        isEditing: true,
        statusMessage: '',
        errorMessage: '',
      }
    }

    const parsed = JSON.parse(raw)
    return {
      formData: normalizeLoadedData(parsed),
      isEditing: false,
      statusMessage: 'Saved teacher profile loaded. Click Edit to update details.',
      errorMessage: '',
    }
  } catch {
    return {
      formData: getDefaultFormData(),
      isEditing: true,
      statusMessage: '',
      errorMessage: 'Unable to read saved teacher profile.',
    }
  }
}

const Teachersprofile = () => {
  const navigate = useNavigate()
  const [initialPageState] = useState(() => getInitialPageState())
  const [formData, setFormData] = useState(initialPageState.formData)
  const [isEditing, setIsEditing] = useState(initialPageState.isEditing)
  const [statusMessage, setStatusMessage] = useState(initialPageState.statusMessage)
  const [errorMessage, setErrorMessage] = useState(initialPageState.errorMessage)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const selectedSubjects = Array.isArray(formData.subjectsTaught) ? formData.subjectsTaught : []
  const subjectExperiences = formData.subjectExperiences && typeof formData.subjectExperiences === 'object' ? formData.subjectExperiences : {}
  const totalSubjectExperienceYears = selectedSubjects.reduce(
    (total, subject) => total + (Number.parseInt(subjectExperiences[subject] || '0', 10) || 0),
    0,
  )
  const selectedSubjectsText = selectedSubjects.join(', ')
  const hasSelectedSubjects = selectedSubjects.length > 0
  const teacherValidation = (() => {
    const fieldErrors = {}
    const teacherId = formData.teacherId.trim()
    const fullName = formData.fullName.trim()
    const staffId = formData.staffId.trim()
    const gender = formData.gender.trim()
    const mobileNo = formData.mobileNo.replace(/\D/g, '')
    const emailId = formData.emailId.trim().toLowerCase()
    const address = formData.address.trim()
    const city = formData.city.trim()
    const state = formData.state.trim()
    const pincode = String(formData.pincode || '').trim()
    const qualification = String(formData.qualification || '').trim()
    const joiningDate = String(formData.joiningDate || '').trim()
    const joiningAcademicYear = String(formData.joiningAcademicYear || '').trim()
    const aadhaarId = String(formData.aadhaarId || '').trim()

    if (!teacherId) fieldErrors.teacherId = 'Teacher ID is required'
    if (!fullName) fieldErrors.fullName = 'Full Name is required'
    if (!staffId) fieldErrors.staffId = 'Staff ID is required'
    if (!gender) fieldErrors.gender = 'Gender is required'
    if (!mobileNo) fieldErrors.mobileNo = 'Mobile Number is required'
    if (!emailId) fieldErrors.emailId = 'Email ID is required'
    if (!address) fieldErrors.address = 'Address is required'
    if (!city) fieldErrors.city = 'City is required'
    if (!state) fieldErrors.state = 'State is required'
    if (!pincode) fieldErrors.pincode = 'Pincode is required'
    if (!qualification) fieldErrors.qualification = 'Qualification is required'
    if (!selectedSubjects.length) fieldErrors.subjectsTaught = 'Select at least one subject'
    if (!joiningDate) fieldErrors.joiningDate = 'Joining Date is required'
    if (!joiningAcademicYear) fieldErrors.joiningAcademicYear = 'Joining Academic Year is required'
    if (!aadhaarId) fieldErrors.aadhaarId = 'Aadhaar / ID Proof is required'

    if (mobileNo && !/^\d{10}$/.test(mobileNo)) fieldErrors.mobileNo = 'Mobile Number must be 10 digits'
    if (emailId && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(emailId)) fieldErrors.emailId = 'Enter a valid email address'
    if (pincode && !/^\d{6}$/.test(pincode)) fieldErrors.pincode = 'Pincode must be 6 digits'
    if (joiningAcademicYear && !/^\d{4}$/.test(joiningAcademicYear)) {
      fieldErrors.joiningAcademicYear = 'Joining Academic Year must be 4 digits'
    }

    selectedSubjects.forEach((subject) => {
      if (!sanitizeExperienceDigits(subjectExperiences[subject] || '')) {
        fieldErrors[`subjectExperience:${subject}`] = `Enter experience years for ${subject}`
      }
    })

    return {
      isValid: Object.keys(fieldErrors).length === 0,
      fieldErrors,
    }
  })()
  const markTouched = (key) => {
    if (!key) return
    setTouchedFields((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
  }
  const shouldShowError = (key) => Boolean(teacherValidation.fieldErrors?.[key]) && (touchedFields[key] || hasSubmitted)
  const getFieldErrorId = (key) => `teacher-error-${key}`
  const hasFieldError = (key) => shouldShowError(key)
  const getFieldProps = (key, extraClass = '') => {
    const showError = shouldShowError(key)
    return {
      className: [extraClass, showError ? 'field-invalid' : ''].filter(Boolean).join(' '),
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
        <span>{teacherValidation.fieldErrors[key]}</span>
      </div>
    )
  }
  const getCurrentUserKey = () => getActiveLoginUser() || (getStoredCredentials().username || '').trim().toLowerCase()

  useEffect(() => {
    const currentUserKey = getCurrentUserKey()
    if (!isSchoolSetupCompleted(currentUserKey)) {
      navigate('/admin-setup')
    }
  }, [navigate])

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrorMessage('')
    setStatusMessage('')
  }

  const setPreviousExperienceField = (id, key, value) => {
    setFormData((prev) => ({
      ...prev,
      previousExperiences: prev.previousExperiences.map((experience) =>
        experience.id === id ? { ...experience, [key]: value } : experience,
      ),
    }))
    setErrorMessage('')
    setStatusMessage('')
  }

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file || !isEditing) return

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        profilePhotoDataUrl: reader.result || '',
        profilePhotoName: file.name,
      }))
      setErrorMessage('')
      setStatusMessage('')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleFileUpload = (field) => (event) => {
    const file = event.target.files?.[0]
    if (!file || !isEditing) return
    setField(field, toFileMeta(file))
    event.target.value = ''
  }

  const handlePreviousResumeUpload = (id) => (event) => {
    const file = event.target.files?.[0]
    if (!file || !isEditing) return
    setPreviousExperienceField(id, 'resumeFile', toFileMeta(file))
    event.target.value = ''
  }

  const addAnotherExperience = () => {
    if (!isEditing) return
    setFormData((prev) => ({
      ...prev,
      previousExperiences: [...prev.previousExperiences, createPreviousExperience(prev.previousExperiences.length + 1)],
    }))
    setErrorMessage('')
    setStatusMessage('')
  }

  const removeExperience = (id) => {
    if (!isEditing) return
    setFormData((prev) => {
      const remaining = prev.previousExperiences.filter((experience) => experience.id !== id)
      return {
        ...prev,
        previousExperiences: remaining.length ? remaining : [createPreviousExperience(1)],
      }
    })
    setErrorMessage('')
    setStatusMessage('')
  }

  const handleEnableEdit = () => {
    setIsEditing(true)
    setShowSuccessPopup(false)
    setErrorMessage('')
    setStatusMessage('Edit mode enabled. You can update all fields now.')
  }

  const setSubjectSelection = (subject, checked) => {
    if (!isEditing) return
    markTouched('subjectsTaught')
    setFormData((prev) => {
      const currentSubjects = Array.isArray(prev.subjectsTaught) ? prev.subjectsTaught : []
      const nextSubjects = checked
        ? Array.from(new Set([...currentSubjects, subject]))
        : currentSubjects.filter((entry) => entry !== subject)
      const currentSubjectExperiences = prev.subjectExperiences && typeof prev.subjectExperiences === 'object'
        ? prev.subjectExperiences
        : {}
      const nextSubjectExperiences = nextSubjects.reduce((acc, subjectEntry) => {
        acc[subjectEntry] = sanitizeExperienceDigits(currentSubjectExperiences[subjectEntry] || '')
        return acc
      }, {})
      const nextTotalExperienceYears = nextSubjects.reduce(
        (total, subjectEntry) => total + (Number.parseInt(nextSubjectExperiences[subjectEntry] || '0', 10) || 0),
        0,
      )
      const nextExperienceTrack = nextSubjects.find((subjectEntry) => nextSubjectExperiences[subjectEntry]) || ''

      return {
        ...prev,
        subjectsTaught: nextSubjects,
        subjectExperiences: nextSubjectExperiences,
        experienceYears: nextTotalExperienceYears ? String(nextTotalExperienceYears) : '',
        experienceTrack: nextExperienceTrack,
      }
    })
    setErrorMessage('')
    setStatusMessage('')
  }

  const clearSelectedSubjects = () => {
    if (!isEditing) return
    markTouched('subjectsTaught')
    setFormData((prev) => ({ ...prev, subjectsTaught: [], subjectExperiences: {}, experienceYears: '', experienceTrack: '' }))
    setErrorMessage('')
    setStatusMessage('')
  }

  const setSubjectExperienceYears = (subject, yearsValue) => {
    if (!isEditing) return

    const normalizedYears = sanitizeExperienceDigits(yearsValue)
    setFormData((prev) => {
      const currentSubjectExperiences = prev.subjectExperiences && typeof prev.subjectExperiences === 'object'
        ? prev.subjectExperiences
        : {}
      const nextSubjectExperiences = {
        ...currentSubjectExperiences,
        [subject]: normalizedYears,
      }
      const nextSubjects = Array.isArray(prev.subjectsTaught) ? prev.subjectsTaught : []
      const nextTotalExperienceYears = nextSubjects.reduce(
        (total, subjectEntry) => total + (Number.parseInt(nextSubjectExperiences[subjectEntry] || '0', 10) || 0),
        0,
      )
      const nextExperienceTrack = nextSubjects.find((subjectEntry) => nextSubjectExperiences[subjectEntry]) || ''

      return {
        ...prev,
        subjectExperiences: nextSubjectExperiences,
        experienceYears: nextTotalExperienceYears ? String(nextTotalExperienceYears) : '',
        experienceTrack: nextExperienceTrack,
      }
    })
    setErrorMessage('')
    setStatusMessage('')
  }

  const handleSave = () => {
    setHasSubmitted(true)
    if (!teacherValidation.isValid) {
      setErrorMessage(FORM_INVALID_MESSAGE)
      setStatusMessage('')
      setShowSuccessPopup(false)
      return
    }

    const normalizedSubjectExperiences = selectedSubjects.reduce((acc, subject) => {
      acc[subject] = sanitizeExperienceDigits(subjectExperiences[subject] || '')
      return acc
    }, {})
    const totalExperienceYears = selectedSubjects.reduce(
      (total, subject) => total + (Number.parseInt(normalizedSubjectExperiences[subject] || '0', 10) || 0),
      0,
    )

    const payload = {
      ...formData,
      subjectsTaught: selectedSubjects,
      subjectExperiences: normalizedSubjectExperiences,
      experienceYears: totalExperienceYears ? String(totalExperienceYears) : '',
      experienceTrack: selectedSubjects.find((subject) => normalizedSubjectExperiences[subject]) || '',
      mobileNo: formData.mobileNo.replace(/\D/g, ''),
      emailId: formData.emailId.trim().toLowerCase(),
    }

    try {
      localStorage.setItem(TEACHER_PROFILE_STORAGE_KEY, JSON.stringify(payload))
      const currentUserKey = getCurrentUserKey()
      const isMarkedCompleted = markTeacherProfileCompleted(currentUserKey)
      if (!isMarkedCompleted) {
        setErrorMessage('Unable to save teacher profile. Please try again.')
        setStatusMessage('')
        setShowSuccessPopup(false)
        return
      }
      setFormData(payload)
      setIsEditing(false)
      setShowSuccessPopup(true)
      setErrorMessage('')
      setStatusMessage('')
    } catch {
      setErrorMessage('Unable to save teacher profile. Please try again.')
      setStatusMessage('')
      setShowSuccessPopup(false)
    }
  }

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false)
    navigate(getPostLoginRoute(getCurrentUserKey()))
  }

  const getFileLabel = (fileMeta, fallbackLabel) => (fileMeta?.name ? `${fileMeta.name}    ${fileMeta.sizeLabel || ''}` : fallbackLabel)

  return (
    <div className="teacher-profile-page">
      <div className="teacher-profile-shell">
        <header className="teacher-profile-header">
          <div className="teacher-header-copy">
            <h1>Teacher Profile</h1>
            <p>
              <span>Add / Edit Teacher</span>
              <ArrowForwardIosRoundedIcon fontSize="inherit" />
            </p>
          </div>

          <div className="teacher-header-actions">
            <button type="button" className="teacher-edit-btn" onClick={handleEnableEdit}>
              <EditOutlinedIcon fontSize="inherit" />
              <span>Edit</span>
            </button>
            <button type="button" className="teacher-save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </header>

        <section className="teacher-card profile-info-card">
          <h2 className="teacher-section-title">
            <PersonOutlinedIcon fontSize="small" />
            <span>Profile Info</span>
          </h2>

          <div className="profile-info-layout">
            <div className="profile-top-grid">
              <label className="profile-field-row required">
                <span>Teacher ID</span>
                <div className="field-stack">
                  <input
                    {...getFieldProps('teacherId')}
                    value={formData.teacherId}
                    onChange={(event) => setField('teacherId', event.target.value)}
                    placeholder="Enter ID"
                    disabled={!isEditing}
                  />
                  {renderFieldError('teacherId')}
                </div>
              </label>

              <label className="profile-field-row required">
                <span>FullName</span>
                <div className="field-stack">
                  <input
                    {...getFieldProps('fullName')}
                    value={formData.fullName}
                    onChange={(event) => setField('fullName', event.target.value)}
                    placeholder="Enter FullName"
                    disabled={!isEditing}
                  />
                  {renderFieldError('fullName')}
                </div>
              </label>

              <label className="profile-field-row required">
                <span>Staff ID</span>
                <div className="field-stack">
                  <input
                    {...getFieldProps('staffId')}
                    value={formData.staffId}
                    onChange={(event) => setField('staffId', event.target.value)}
                    placeholder="Enter ID"
                    disabled={!isEditing}
                  />
                  {renderFieldError('staffId')}
                </div>
              </label>

              <label className="profile-field-row required">
                <span>Gender</span>
                <div className="field-stack">
                  <select {...getFieldProps('gender')} value={formData.gender} onChange={(event) => setField('gender', event.target.value)} disabled={!isEditing}>
                    <option value="">Enter Gender</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  {renderFieldError('gender')}
                </div>
              </label>
            </div>

            <div className="profile-upload-row">
              <div className="profile-upload-outline">
                <div className="profile-upload-preview">
                  {formData.profilePhotoDataUrl ? (
                    <img src={formData.profilePhotoDataUrl} alt="Teacher profile" />
                  ) : (
                    <UploadOutlinedIcon className="profile-upload-icon" />
                  )}
                </div>
              </div>

              <div className="profile-upload-controls">
                <label className={`primary-upload-btn ${!isEditing ? 'disabled' : ''}`}>
                  Upload
                  <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} disabled={!isEditing} hidden />
                </label>
                {formData.profilePhotoName ? <small>{formData.profilePhotoName}</small> : null}
              </div>
            </div>
          </div>
        </section>

        <div className="teacher-details-grid">
          <div className="teacher-left-column">
            <section className="teacher-card">
              <h2 className="teacher-section-title">
                <CallOutlinedIcon fontSize="small" />
                <span>Contact Details</span>
              </h2>

              <label className="teacher-field-label required">Mobile No.</label>
              <div className="field-stack">
                <input
                  {...getFieldProps('mobileNo')}
                  value={formData.mobileNo}
                  onChange={(event) => setField('mobileNo', event.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter Mobile Number"
                  disabled={!isEditing}
                  inputMode="numeric"
                />
                {renderFieldError('mobileNo')}
              </div>

              <label className="teacher-field-label required">Email ID</label>
              <div className="field-stack">
                <input
                  {...getFieldProps('emailId')}
                  value={formData.emailId}
                  onChange={(event) => setField('emailId', event.target.value)}
                  placeholder="Enter Email ID"
                  disabled={!isEditing}
                />
                {renderFieldError('emailId')}
              </div>

              <label className="teacher-field-label">Address</label>
              <div className="field-stack">
                <input
                  {...getFieldProps('address')}
                  value={formData.address}
                  onChange={(event) => setField('address', event.target.value)}
                  placeholder="Enter Address"
                  disabled={!isEditing}
                />
                {renderFieldError('address')}
              </div>

              <div className="two-field-row">
                <div>
                  <label className="teacher-field-label required">City</label>
                  <div className="field-stack">
                    <select {...getFieldProps('city')} value={formData.city} onChange={(event) => setField('city', event.target.value)} disabled={!isEditing}>
                      <option value="">Enter City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {renderFieldError('city')}
                  </div>
                </div>

                <div>
                  <label className="teacher-field-label required">State</label>
                  <div className="field-stack">
                    <select {...getFieldProps('state')} value={formData.state} onChange={(event) => setField('state', event.target.value)} disabled={!isEditing}>
                      <option value="">Enter State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {renderFieldError('state')}
                  </div>
                </div>
              </div>

              <label className="teacher-field-label">Pincode</label>
              <div className="field-stack">
                <input
                  {...getFieldProps('pincode')}
                  value={formData.pincode}
                  onChange={(event) => setField('pincode', event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter Pincode"
                  disabled={!isEditing}
                  inputMode="numeric"
                />
                {renderFieldError('pincode')}
              </div>
            </section>

            <section className="teacher-card">
              <h2 className="teacher-section-title">
                <WorkOutlineOutlinedIcon fontSize="small" />
                <span>Previous Experience</span>
              </h2>

              {formData.previousExperiences.map((experience, index) => (
                <div key={experience.id} className={`previous-experience-block ${index > 0 ? 'with-divider' : ''}`}>
                  <div className="experience-block-header">
                    <p className="experience-index">Experience {index + 1}</p>
                    {formData.previousExperiences.length > 1 ? (
                      <button
                        type="button"
                        className="experience-remove-btn"
                        onClick={() => removeExperience(experience.id)}
                        aria-label={`Delete experience ${index + 1}`}
                        disabled={!isEditing}
                      >
                        <CloseRoundedIcon fontSize="small" />
                        <span>Delete</span>
                      </button>
                    ) : null}
                  </div>

                  <label className="teacher-field-label">Previous School Name</label>
                  <input
                    value={experience.schoolName}
                    onChange={(event) => setPreviousExperienceField(experience.id, 'schoolName', event.target.value)}
                    placeholder="Enter Previous School Name"
                    disabled={!isEditing}
                  />

                  <label className="teacher-field-label date-label-inline">
                    <span>Date of Joining</span>
                    <CalendarTodayOutlinedIcon fontSize="inherit" />
                  </label>
                  <div className="date-range-row">
                    <input
                      type="date"
                      value={experience.fromDate}
                      onChange={(event) => setPreviousExperienceField(experience.id, 'fromDate', event.target.value)}
                      disabled={!isEditing}
                    />
                    <input
                      type="date"
                      value={experience.toDate}
                      onChange={(event) => setPreviousExperienceField(experience.id, 'toDate', event.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <label className="teacher-field-label">Upload Resume</label>
                  <label className={`teacher-file-row ${isEditing ? 'editable' : ''}`}>
                    <div className="teacher-file-row-left">
                      <InsertDriveFileOutlinedIcon fontSize="small" />
                      <span>{getFileLabel(experience.resumeFile, 'Upload previous resume')}</span>
                    </div>
                    <CheckOutlinedIcon fontSize="small" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handlePreviousResumeUpload(experience.id)}
                      disabled={!isEditing}
                      hidden
                    />
                  </label>
                </div>
              ))}
            </section>
          </div>

          <div className="teacher-right-column">
            <section className="teacher-card">
              <h2 className="teacher-section-title">
                <WorkOutlineOutlinedIcon fontSize="small" />
                <span>Professional Details</span>
              </h2>

              <label className="teacher-field-label">Qualification B.Ed</label>
              <div className="field-stack">
                <select
                  {...getFieldProps('qualification')}
                  value={formData.qualification}
                  onChange={(event) => setField('qualification', event.target.value)}
                  disabled={!isEditing}
                >
                  {qualifications.map((qualification) => (
                    <option key={qualification} value={qualification}>
                      {qualification}
                    </option>
                  ))}
                </select>
                {renderFieldError('qualification')}
              </div>

              <label className="teacher-field-label">Subjects Taught</label>
              <div className={`subjects-checkbox-grid ${hasFieldError('subjectsTaught') ? 'subjects-invalid' : ''}`}>
                {subjectOptions.map((subject) => (
                  <label key={subject} className={`subject-checkbox-option ${selectedSubjects.includes(subject) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={(event) => setSubjectSelection(subject, event.target.checked)}
                      disabled={!isEditing}
                    />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
              {renderFieldError('subjectsTaught')}

              <div className="selected-subjects-summary">
                <input value={selectedSubjectsText} readOnly placeholder="Select subjects from the checkboxes" />
                {selectedSubjects.length ? (
                  <button
                    type="button"
                    className="clear-subject-btn"
                    onClick={clearSelectedSubjects}
                    disabled={!isEditing}
                    aria-label="Clear subjects"
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </button>
                ) : null}
              </div>

              <label className="teacher-field-label">Experience ({totalSubjectExperienceYears})</label>
              {hasSelectedSubjects ? (
                <div className="experience-by-subject-list">
                  {selectedSubjects.map((subject) => (
                    <div key={subject} className="experience-subject-row">
                      <span className="experience-subject-name">{subject}</span>
                      <div className="field-stack">
                        <input
                          {...getFieldProps(`subjectExperience:${subject}`, 'experience-years-input')}
                          value={subjectExperiences[subject] || ''}
                          onChange={(event) => setSubjectExperienceYears(subject, event.target.value)}
                          placeholder="Years"
                          inputMode="numeric"
                          disabled={!isEditing}
                        />
                        {renderFieldError(`subjectExperience:${subject}`, 'compact')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              {!hasSelectedSubjects ? <small className="subject-hint">Select subjects to enter experience years for each.</small> : null}

              <label className="teacher-field-label date-label-inline">
                <span>Joining Date</span>
                <CalendarTodayOutlinedIcon fontSize="inherit" />
              </label>
              <div className="date-range-row">
                <div className="field-stack">
                  <input
                    {...getFieldProps('joiningDate')}
                    type="date"
                    value={formData.joiningDate}
                    onChange={(event) => setField('joiningDate', event.target.value)}
                    disabled={!isEditing}
                  />
                  {renderFieldError('joiningDate')}
                </div>
                <div className="field-stack">
                  <input
                    {...getFieldProps('joiningAcademicYear')}
                    type="text"
                    value={formData.joiningAcademicYear}
                    onChange={(event) => setField('joiningAcademicYear', event.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="2024"
                    inputMode="numeric"
                    disabled={!isEditing}
                  />
                  {renderFieldError('joiningAcademicYear')}
                </div>
              </div>
            </section>

            <section className="teacher-card">
              <h2 className="teacher-section-title">
                <DescriptionOutlinedIcon fontSize="small" />
                <span>Identity &amp; Documents</span>
              </h2>

              <label className="teacher-field-label required">Aadhar / ID Proof</label>
              <div className="field-stack">
                <input
                  {...getFieldProps('aadhaarId')}
                  value={formData.aadhaarId}
                  onChange={(event) => setField('aadhaarId', event.target.value)}
                  placeholder="1234-5678-XXXX"
                  disabled={!isEditing}
                />
                {renderFieldError('aadhaarId')}
              </div>

              <label className={`teacher-file-row ${isEditing ? 'editable' : ''}`}>
                <div className="teacher-file-row-left">
                  <InsertDriveFileOutlinedIcon fontSize="small" />
                  <span>{getFileLabel(formData.idProofFile, 'Upload ID proof')}</span>
                </div>
                <CheckOutlinedIcon fontSize="small" />
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload('idProofFile')} disabled={!isEditing} hidden />
              </label>

              <label className="teacher-field-label">Upload Resume</label>
              <label className={`teacher-file-row ${isEditing ? 'editable' : ''}`}>
                <div className="teacher-file-row-left">
                  <InsertDriveFileOutlinedIcon fontSize="small" />
                  <span>{getFileLabel(formData.teacherResumeFile, 'Upload resume')}</span>
                </div>
                <CheckOutlinedIcon fontSize="small" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload('teacherResumeFile')}
                  disabled={!isEditing}
                  hidden
                />
              </label>

              <button type="button" className="add-experience-btn" onClick={addAnotherExperience} disabled={!isEditing}>
                <AddCircleOutlineOutlinedIcon fontSize="small" />
                <span>Add Another Experience</span>
              </button>
            </section>
          </div>
        </div>

        {errorMessage ? (
          <div className="teacher-message error">
            <WarningAmberRoundedIcon fontSize="small" />
            <span>{errorMessage}</span>
          </div>
        ) : null}
        {statusMessage ? <div className="teacher-message success">{statusMessage}</div> : null}

        {showSuccessPopup ? (
          <div className="teacher-success-overlay" role="dialog" aria-modal="true" aria-labelledby="teacher-success-title">
            <div className="teacher-success-card">
              <h3 id="teacher-success-title">Saved Successfully</h3>
              <p>Teacher profile details saved successfully.</p>
              <button type="button" className="teacher-success-btn" onClick={handleSuccessPopupClose}>
                OK
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Teachersprofile
