const AUTH_STORAGE_KEY = 'schoolers_auth_admin'
const DEFAULT_PASSWORD_RETIRED_KEY = 'schoolers_default_password_retired'
export const DEFAULT_PASSWORD = 'Dummy@123'

export const DEFAULT_CREDENTIALS = {
  username: 'schooladmin1',
  password: DEFAULT_PASSWORD,
  needsPasswordReset: true,
}

export const SECONDARY_DEFAULT_CREDENTIALS = {
  username: 'schooladmin2',
  password: DEFAULT_PASSWORD,
  needsPasswordReset: true,
}

export const TERTIARY_DEFAULT_CREDENTIALS = {
  username: 'schooladmin3',
  password: DEFAULT_PASSWORD,
  needsPasswordReset: true,
}

export const QUATERNARY_DEFAULT_CREDENTIALS = {
  username: 'schooladmin4',
  password: DEFAULT_PASSWORD,
  needsPasswordReset: true,
}

export const QUINARY_DEFAULT_CREDENTIALS = {
  username: 'schooladmin5',
  password: DEFAULT_PASSWORD,
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
    const parsedUsername = (parsed?.username || parsed?.email || '').trim()
    if (!parsedUsername || !parsed?.password) return DEFAULT_CREDENTIALS

    return {
      username: parsedUsername,
      password: parsed.password,
      needsPasswordReset:
        typeof parsed.needsPasswordReset === 'boolean'
          ? parsed.needsPasswordReset
          : DUMMY_RESET_CREDENTIALS.some(
              (cred) => cred.username === parsedUsername && cred.password === parsed.password,
            ),
    }
  } catch {
    return DEFAULT_CREDENTIALS
  }
}

export const isDefaultPasswordRetired = () => localStorage.getItem(DEFAULT_PASSWORD_RETIRED_KEY) === 'true'

export const saveNewPassword = (newPassword) => {
  const current = getStoredCredentials()
  const updated = {
    ...current,
    password: newPassword,
    needsPasswordReset: false,
  }
  if (current.password === DEFAULT_PASSWORD) {
    localStorage.setItem(DEFAULT_PASSWORD_RETIRED_KEY, 'true')
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated))
  localStorage.setItem(`schoolers_password_${updated.username}`, newPassword)
  return updated
}

export const setStoredCredentials = (credentials) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(credentials))
}
