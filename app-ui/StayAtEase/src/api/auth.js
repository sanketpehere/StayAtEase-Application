import api from './client'

// POST /api/v1/auth/ui/signup  → CustomerSignupDto { fullName, email, password }
export const signup = (data) => api.post('/auth/ui/signup', data)

// POST /api/v1/auth/social/signup  → { email, name, provider, picture }
export const socialSignup = (data) => api.post('/auth/social/signup', data)

// (placeholder — add login endpoint when ready on backend)
export const login = (data) => api.post('/auth/login', data)
