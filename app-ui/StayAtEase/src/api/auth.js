import api from './client'

// POST /api/v1/auth/ui/signup  → { fullName, email, password }
export const signup = (data) =>
  api.post('/auth/ui/signup', data, {
    // Signup can take longer in staging because SMTP delivery is synchronous.
    timeout: 5000,
  })

// POST /api/v1/auth/ui/login  → { email, password }
export const login = (data) => api.post('/auth/ui/login', data)

// POST /api/v1/auth/social/signup  → { email, name, provider, picture }
export const socialSignup = (data) => api.post('/auth/social/signup', data)