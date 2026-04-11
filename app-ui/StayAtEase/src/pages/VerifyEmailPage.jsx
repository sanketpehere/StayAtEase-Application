import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../api/client'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')
  const called = useRef(false) // ← add this

  useEffect(() => {
  if (called.current) return // ← skip second call
      called.current = true

    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success')
        setMessage(res.data.message)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed. Please try again.')
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">

        {status === 'loading' && (
          <>
            <Loader2 size={48} className="animate-spin text-brand-red mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-brand-dark">Verifying your email...</h2>
            <p className="text-gray-500 text-sm mt-2">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-brand-dark">Email Verified!</h2>
            <p className="text-gray-500 text-sm mt-2 mb-6">{message}</p>
            <Link to="/auth" className="btn-primary px-8 py-3">
              Login to your account
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-brand-dark">Verification Failed</h2>
            <p className="text-gray-500 text-sm mt-2 mb-6">{message}</p>
            <Link to="/auth" className="btn-primary px-8 py-3">
              Back to Login
            </Link>
          </>
        )}

      </div>
    </div>
  )
}