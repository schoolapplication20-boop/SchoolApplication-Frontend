const SCHOOL_SETUP_KEY = 'schoolers_admin_setup_data'
const SCHOOL_SETUP_COMPLETED_KEY = 'schoolers_admin_setup_completed'
const SCHOOL_SETUP_COMPLETED_USERS_KEY = 'schoolers_admin_setup_completed_users'
const TEACHER_PROFILE_COMPLETED_KEY = 'schoolers_teacher_profile_completed'
const TEACHER_PROFILE_COMPLETED_USERS_KEY = 'schoolers_teacher_profile_completed_users'
const ACTIVE_LOGIN_USER_KEY = 'schoolers_active_login_user'

const normalizeUserKey = (userKey) => String(userKey || '').trim().toLowerCase()

const getCompletedUsers = () => {
  try {
    const raw = localStorage.getItem(SCHOOL_SETUP_COMPLETED_USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const getTeacherProfileCompletedUsers = () => {
  try {
    const raw = localStorage.getItem(TEACHER_PROFILE_COMPLETED_USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const setCompletedForUser = (userKey) => {
  const normalizedUserKey = normalizeUserKey(userKey)
  if (!normalizedUserKey) return
  const completedUsers = getCompletedUsers()
  completedUsers[normalizedUserKey] = true
  localStorage.setItem(SCHOOL_SETUP_COMPLETED_USERS_KEY, JSON.stringify(completedUsers))
}

const setTeacherProfileCompletedForUser = (userKey) => {
  const normalizedUserKey = normalizeUserKey(userKey)
  if (!normalizedUserKey) return
  const completedUsers = getTeacherProfileCompletedUsers()
  completedUsers[normalizedUserKey] = true
  localStorage.setItem(TEACHER_PROFILE_COMPLETED_USERS_KEY, JSON.stringify(completedUsers))
}

export const setActiveLoginUser = (userKey) => {
  const normalizedUserKey = normalizeUserKey(userKey)
  if (!normalizedUserKey) {
    localStorage.removeItem(ACTIVE_LOGIN_USER_KEY)
    return
  }
  localStorage.setItem(ACTIVE_LOGIN_USER_KEY, normalizedUserKey)
}

export const getActiveLoginUser = () => normalizeUserKey(localStorage.getItem(ACTIVE_LOGIN_USER_KEY))

export const getSchoolSetupData = () => {
  try {
    const raw = localStorage.getItem(SCHOOL_SETUP_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const saveSchoolSetupData = (data, userKey = '') => {
  try {
    localStorage.setItem(SCHOOL_SETUP_KEY, JSON.stringify(data))
    localStorage.setItem(SCHOOL_SETUP_COMPLETED_KEY, 'true')
    setCompletedForUser(userKey || getActiveLoginUser())
    return true
  } catch {
    return false
  }
}

export const isSchoolSetupCompleted = (userKey = '') => {
  const normalizedUserKey = normalizeUserKey(userKey || getActiveLoginUser())
  if (normalizedUserKey) {
    const completedUsers = getCompletedUsers()
    return completedUsers[normalizedUserKey] === true
  }
  return localStorage.getItem(SCHOOL_SETUP_COMPLETED_KEY) === 'true'
}

export const markTeacherProfileCompleted = (userKey = '') => {
  try {
    localStorage.setItem(TEACHER_PROFILE_COMPLETED_KEY, 'true')
    setTeacherProfileCompletedForUser(userKey || getActiveLoginUser())
    return true
  } catch {
    return false
  }
}

export const isTeacherProfileCompleted = (userKey = '') => {
  const normalizedUserKey = normalizeUserKey(userKey || getActiveLoginUser())
  if (normalizedUserKey) {
    const completedUsers = getTeacherProfileCompletedUsers()
    return completedUsers[normalizedUserKey] === true
  }
  return localStorage.getItem(TEACHER_PROFILE_COMPLETED_KEY) === 'true'
}

export const getPostLoginRoute = (userKey = '') => {
  if (!isSchoolSetupCompleted(userKey)) return '/admin-setup'
  if (!isTeacherProfileCompleted(userKey)) return '/teachers-profile'
  return '/dashboard'
}


