import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import OwnerProtectedRoute from './components/common/OwnerProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import HotelsPage from './pages/HotelsPage'
import HotelDetailPage from './pages/HotelDetailPage'
import BookingPage from './pages/BookingPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage'

function Layout({ children, hideFooter }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth — no navbar/footer */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Email verification */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Public routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/hotels" element={<Layout><HotelsPage /></Layout>} />
          <Route path="/hotels/:hotelId" element={<Layout><HotelDetailPage /></Layout>} />

          {/* Customer protected routes */}
          <Route path="/booking" element={
            <Layout hideFooter>
              <ProtectedRoute><BookingPage /></ProtectedRoute>
            </Layout>
          } />
          <Route path="/dashboard" element={
            <Layout>
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            </Layout>
          } />

          {/* Owner protected routes */}
          <Route path="/owner/dashboard" element={
            <OwnerProtectedRoute><OwnerDashboardPage /></OwnerProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}