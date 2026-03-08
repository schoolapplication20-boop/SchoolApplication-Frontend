const AUTH_STORAGE_KEY = 'schoolers_auth_admin'
const DEFAULT_PASSWORD_RETIRED_KEY = 'schoolers_default_password_retired'
export const DEFAULT_PASSWORD = 'Dummy@123'

const createDefaultCredential = (username) => ({
  username,
  password: DEFAULT_PASSWORD,
  needsPasswordReset: true,
})

export const DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin1')
export const SECONDARY_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin2')
export const TERTIARY_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin3')
export const QUATERNARY_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin4')
export const QUINARY_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin5')
export const SIXTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin6')
export const SEVENTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin7')
export const EIGHTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin8')
export const NINTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin9')
export const TENTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin10')
export const ELEVENTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin11')
export const TWELFTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin12')
export const THIRTEENTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin13')
export const FOURTEENTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin14')
export const FIFTEENTH_DEFAULT_CREDENTIALS = createDefaultCredential('schooladmin15')

export const DUMMY_RESET_CREDENTIALS = [
  DEFAULT_CREDENTIALS,
  SECONDARY_DEFAULT_CREDENTIALS,
  TERTIARY_DEFAULT_CREDENTIALS,
  QUATERNARY_DEFAULT_CREDENTIALS,
  QUINARY_DEFAULT_CREDENTIALS,
  SIXTH_DEFAULT_CREDENTIALS,
  SEVENTH_DEFAULT_CREDENTIALS,
  EIGHTH_DEFAULT_CREDENTIALS,
  NINTH_DEFAULT_CREDENTIALS,
  TENTH_DEFAULT_CREDENTIALS,
  ELEVENTH_DEFAULT_CREDENTIALS,
  TWELFTH_DEFAULT_CREDENTIALS,
  THIRTEENTH_DEFAULT_CREDENTIALS,
  FOURTEENTH_DEFAULT_CREDENTIALS,
  FIFTEENTH_DEFAULT_CREDENTIALS,
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
