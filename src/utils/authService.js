// Mock authentication service.
// Simulates an API call with a short delay.
// Replace the body of mockLogin with a real fetch/axios call once the backend is ready.
import DUMMY_USERS from './dummyUsers'

/**
 * Simulates an API login request.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ email: string, role: string }>} Resolves with user info on success.
 */
export const mockLogin = (email, password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = DUMMY_USERS.find(
        (u) => u.email === email.toLowerCase() && u.password === password,
      )
      if (user) {
        resolve({ email: user.email, role: user.role })
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 500)
  })

// Role → route mapping. Update paths here if routes change.
export const ROLE_ROUTES = {
  admin: '/dashboard',
  teacher: '/teachers',
  parent: '/parent-dashboard',
}

// Tracks whether a dummy user has completed their first-login password reset.
const resetDoneKey = (email) => `schoolers_dummy_reset_${email}`

export const isDummyUserFirstLogin = (email) =>
  localStorage.getItem(resetDoneKey(email)) !== 'done'

export const markDummyUserResetDone = (email) =>
  localStorage.setItem(resetDoneKey(email), 'done')
