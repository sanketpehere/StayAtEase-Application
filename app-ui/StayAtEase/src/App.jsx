import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import HotelsPage from './pages/HotelsPage'
import HotelDetailPage from './pages/HotelDetailPage'
import BookingPage from './pages/BookingPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'

// Layout wrapper — shows Navbar/Footer on all pages except auth
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

          {/* Public routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/hotels" element={<Layout><HotelsPage /></Layout>} />
          <Route path="/hotels/:hotelId" element={<Layout><HotelDetailPage /></Layout>} />

          {/* Protected routes */}
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

          {/* 404 */}
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
