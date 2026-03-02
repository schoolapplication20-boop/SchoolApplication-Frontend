const SCHOOL_SETUP_KEY = 'schoolers_admin_setup_data'
const SCHOOL_SETUP_COMPLETED_KEY = 'schoolers_admin_setup_completed'

export const getSchoolSetupData = () => {
  try {
    const raw = localStorage.getItem(SCHOOL_SETUP_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const saveSchoolSetupData = (data) => {
  localStorage.setItem(SCHOOL_SETUP_KEY, JSON.stringify(data))
  localStorage.setItem(SCHOOL_SETUP_COMPLETED_KEY, 'true')
}

export const isSchoolSetupCompleted = () => localStorage.getItem(SCHOOL_SETUP_COMPLETED_KEY) === 'true'

export const getPostLoginRoute = () => (isSchoolSetupCompleted() ? '/dashboard' : '/admin-setup')

