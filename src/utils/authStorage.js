const AUTH_STORAGE_KEY = 'schoolers_auth_admin'

export const DEFAULT_CREDENTIALS = {
  email: 'dummy.user1@gmail.com',
  password: 'Dummy@123',
  needsPasswordReset: true,
}

export const SECONDARY_DEFAULT_CREDENTIALS = {
  email: 'dummy.user2@gmail.com',
  password: 'Dummy@234',
  needsPasswordReset: true,
}

export const TERTIARY_DEFAULT_CREDENTIALS = {
  email: 'dummy.user3@gmail.com',
  password: 'Dummy@345',
  needsPasswordReset: true,
}

export const QUATERNARY_DEFAULT_CREDENTIALS = {
  email: 'dummy.user4@gmail.com',
  password: 'Dummy@456',
  needsPasswordReset: true,
}

export const QUINARY_DEFAULT_CREDENTIALS = {
  email: 'dummy.user5@gmail.com',
  password: 'Dummy@567',
  needsPasswordReset: true,
}

export const DUMMY_RESET_CREDENTIALS = [
  DEFAULT_CREDENTIALS,
  SECONDARY_DEFAULT_CREDENTIALS,
  TERTIARY_DEFAULT_CREDENTIALS,
  QUATERNARY_DEFAULT_CREDENTIALS,
  QUINARY_DEFAULT_CREDENTIALS,
]

export const getStoredCredentials = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return DEFAULT_CREDENTIALS

    const parsed = JSON.parse(raw)
    if (!parsed?.email || !parsed?.password) return DEFAULT_CREDENTIALS

    return {
      email: parsed.email,
      password: parsed.password,
      needsPasswordReset:
        typeof parsed.needsPasswordReset === 'boolean'
          ? parsed.needsPasswordReset
          : DUMMY_RESET_CREDENTIALS.some(
              (cred) => cred.email === parsed.email && cred.password === parsed.password,
            ),
    }
  } catch {
    return DEFAULT_CREDENTIALS
  }
}

export const saveNewPassword = (newPassword) => {
  const current = getStoredCredentials()
  const updated = {
    ...current,
    password: newPassword,
    needsPasswordReset: false,
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export const setStoredCredentials = (credentials) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(credentials))
}

export const markPasswordResetSkipped = () => {
  const current = getStoredCredentials()
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      ...current,
      needsPasswordReset: false,
    }),
  )
}
