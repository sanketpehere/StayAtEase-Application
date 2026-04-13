import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { signup, socialSignup, login as loginApi } from '../api/auth'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2, Building2 } from 'lucide-react'
import api from '../api/client'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2a10.34 10.34 0 0 0-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

export default function AuthPage() {
  const [emailSent, setEmailSent] = useState(false)
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login')
  const [userType, setUserType] = useState('customer') // ← customer or owner
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phoneNumber: '',
    businessName: '', businessEmail: '', businessPhone: '', businessType: '', country: '', state: '', city: ''
  })

  const { login, user, role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (role === 'HOTEL_OWNER') navigate('/owner/dashboard')
      else navigate('/')
    }
  }, [user, role])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      if (userType === 'owner') {
        const res = await api.post('/auth/owner/signup', {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phoneNumber: form.phoneNumber,
          businessName: form.businessName,
          businessEmail: form.businessEmail,
          businessPhone: form.businessPhone,
          businessType: form.businessType,
          country: form.country,
          state: form.state,
          city: form.city,
        })
        login(res.data)
        navigate('/owner/dashboard')
      } else {
        await signup({ fullName: form.fullName, email: form.email, password: form.password })
        setEmailSent(true)
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.code === 'ERR_CANCELED') {
        setError('Signup request timed out. Please try again in a few seconds.')
      } else {
        setError(err.response?.data?.message || 'Signup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      let res
      if (userType === 'owner') {
        res = await api.post('/auth/owner/login', { email: form.email, password: form.password })
      } else {
        res = await loginApi({ email: form.email, password: form.password })
      }
      login(res.data)
      if (res.data.role === 'HOTEL_OWNER') navigate('/owner/dashboard')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
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
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-brand-dark p-12 relative overflow-hidden">
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
            {userType === 'owner' ? 'Grow your hospitality business.' : 'Your perfect stay is one click away.'}
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            {userType === 'owner'
              ? 'List your property on StayAtEase and reach thousands of travelers across India.'
              : 'Join thousands of travelers who book their ideal stays with StayAtEase.'}
          </p>
          <div className="flex gap-6 mt-10">
            {userType === 'owner'
              ? [['10K+', 'Properties'], ['1M+', 'Bookings'], ['4.8★', 'Rating']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display font-bold text-2xl text-white">{val}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))
              : [['10K+', 'Hotels'], ['50K+', 'Happy Guests'], ['4.8★', 'Rating']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display font-bold text-2xl text-white">{val}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))
            }
          </div>
        </div>

        <p className="text-xs text-gray-600 z-10">© {new Date().getFullYear()} StayAtEase</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-red transition-colors mb-8">
            <ArrowLeft size={14} /> Back to home
          </Link>

          {/* User type switcher */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setUserType('customer'); setError(''); setEmailSent(false) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${userType === 'customer' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500'}`}>
              <User size={14} /> Guest
            </button>
            <button
              onClick={() => { setUserType('owner'); setError(''); setEmailSent(false) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${userType === 'owner' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500'}`}>
              <Building2 size={14} /> Hotel Owner
            </button>
          </div>

          <h1 className="font-display text-3xl font-bold text-brand-dark mb-1">
            {mode === 'login' ? 'Welcome back' : userType === 'owner' ? 'List your property' : 'Create account'}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setEmailSent(false) }}
              className="text-brand-red font-medium hover:underline">
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          {emailSent && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-4 mb-5 text-center">
              <p className="font-medium">Check your email! 📧</p>
              <p className="mt-1 text-green-600">We sent a verification link to <strong>{form.email}</strong>.</p>
            </div>
          )}

          {/* Google login — only for customers */}
          {userType === 'customer' && (
            <>
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
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="fullName" placeholder="Full Name" value={form.fullName}
                  onChange={handleChange} className="input-field pl-10" required />
              </div>
            )}

            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" name="email" placeholder="Email address" value={form.email}
                onChange={handleChange} className="input-field pl-10" required />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password"
                value={form.password} onChange={handleChange} className="input-field pl-10 pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Owner specific fields */}
            {mode === 'signup' && userType === 'owner' && (
              <>
                <div className="h-px bg-gray-100 my-2" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Business Details</p>
                <input type="text" name="businessName" placeholder="Business Name" value={form.businessName}
                  onChange={handleChange} className="input-field" required />
                <input type="email" name="businessEmail" placeholder="Business Email" value={form.businessEmail}
                  onChange={handleChange} className="input-field" />
                <input type="tel" name="businessPhone" placeholder="Business Phone" value={form.businessPhone}
                  onChange={handleChange} className="input-field" />
                <select name="businessType" value={form.businessType} onChange={handleChange} className="input-field">
                  <option value="">Select Business Type</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="COMPANY">Company</option>
                  <option value="PARTNERSHIP">Partnership</option>
                </select>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" name="city" placeholder="City" value={form.city}
                    onChange={handleChange} className="input-field" />
                  <input type="text" name="state" placeholder="State" value={form.state}
                    onChange={handleChange} className="input-field" />
                  <input type="text" name="country" placeholder="Country" value={form.country}
                    onChange={handleChange} className="input-field" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {mode === 'login' ? 'Sign In' : userType === 'owner' ? 'Register as Owner' : 'Create Account'}
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