import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null) // ← add role
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('stayatease_user')
    const storedToken = localStorage.getItem('stayatease_token')
    const storedRole = localStorage.getItem('stayatease_role') // ← add role
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
        setRole(storedRole)
      } catch (_) {}
    }
    setLoading(false)
  }, [])

  const login = (authResponse) => {
    setUser(authResponse.user)
    setToken(authResponse.token)
    setRole(authResponse.role)
    localStorage.setItem('stayatease_user', JSON.stringify(authResponse.user))
    localStorage.setItem('stayatease_token', authResponse.token)
    localStorage.setItem('stayatease_role', authResponse.role) // ← store role
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setRole(null)
    localStorage.removeItem('stayatease_user')
    localStorage.removeItem('stayatease_token')
    localStorage.removeItem('stayatease_role') // ← clear role
  }

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}