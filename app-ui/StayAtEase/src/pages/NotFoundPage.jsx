import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center animate-fade-up">
        <div className="text-8xl font-display font-bold text-brand-red mb-4">404</div>
        <h2 className="font-display text-2xl font-bold text-brand-dark mb-3">Page Not Found</h2>
        <p className="text-gray-500 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
          <button onClick={() => navigate('/hotels')} className="btn-secondary">Browse Hotels</button>
        </div>
      </div>
    </div>
  )
}
