import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { signup, socialSignup } from '../api/auth'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2 } from 'lucide-react'

// Google icon SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2a10.34 10.34 0 0 0-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' })

  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/') }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  // Standard email/password signup → POST /api/v1/auth/ui/signup
  const handleSignup = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await signup({ fullName: form.fullName, email: form.email, password: form.password })
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Login (placeholder until backend login endpoint is ready)
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const res = await import('../api/auth').then(m => m.login({ email: form.email, password: form.password }))
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth → fetch user info → POST /api/v1/auth/social/signup
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        // Fetch user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then(r => r.json())

        const res = await socialSignup({
          email: userInfo.email,
          name: userInfo.name,
          provider: 'GOOGLE',
          picture: userInfo.picture,
        })
        login(res.data)
        navigate('/')
      } catch (err) {
        setError('Google sign-in failed. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    onError: () => setError('Google sign-in was cancelled or failed.'),
  })

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-brand-dark p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${200 + i * 80}px`, height: `${200 + i * 80}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          ))}
        </div>

        <Link to="/" className="flex items-center gap-2 z-10">
          <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center">
            <span className="text-white font-display font-bold">S</span>
          </div>
          <span className="font-display font-bold text-2xl text-white">StayAtEase</span>
        </Link>

        <div className="z-10">
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Your perfect stay<br />is one click away.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Join thousands of travelers who book their ideal stays with StayAtEase — from budget escapes to luxury retreats.
          </p>

          <div className="flex gap-6 mt-10">
            {[['10K+', 'Hotels'], ['50K+', 'Happy Guests'], ['4.8★', 'Rating']].map(([val, label]) => (
              <div key={label}>
                <div className="font-display font-bold text-2xl text-white">{val}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600 z-10">© {new Date().getFullYear()} StayAtEase</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-red transition-colors mb-8">
            <ArrowLeft size={14} /> Back to home
          </Link>

          <h1 className="font-display text-3xl font-bold text-brand-dark mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              className="text-brand-red font-medium hover:underline">
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          {/* Google Button */}
          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:border-brand-red hover:bg-red-50 transition-all duration-200 mb-6"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" name="fullName" placeholder="Full Name" value={form.fullName}
                  onChange={handleChange} className="input-field pl-10" required
                />
              </div>
            )}

            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" name="email" placeholder="Email address" value={form.email}
                onChange={handleChange} className="input-field pl-10" required
              />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'} name="password" placeholder="Password"
                value={form.password} onChange={handleChange} className="input-field pl-10 pr-10" required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-brand-red">Terms of Service</a> and{' '}
            <a href="#" className="underline hover:text-brand-red">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
