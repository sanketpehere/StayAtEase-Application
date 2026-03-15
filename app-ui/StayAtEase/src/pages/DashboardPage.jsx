import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyBookings, cancelBooking } from '../api/bookings'
import StarRating from '../components/common/StarRating'
import { LayoutDashboard, Calendar, User, Settings, LogOut, MapPin, ChevronRight, Loader2, AlertCircle, CheckCircle, Clock, XCircle, Flag } from 'lucide-react'

// BookingStatus enum: CREATED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
const STATUS_CONFIG = {
  CREATED:   { label: 'Created',   color: 'bg-blue-100 text-blue-700' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
  NO_SHOW:   { label: 'No Show',   color: 'bg-amber-100 text-amber-700' },
}

const MOCK_BOOKINGS = [
  { bookingId: 'BK-A1B2C3', hotel: { hotelName: 'The Grand Mumbai', city: 'Mumbai' }, hotelRoomType: { roomTypeName: 'Deluxe Room' }, startDate: '2026-04-10', endDate: '2026-04-13', finalAmount: 21675, bookingStatus: 'CONFIRMED', bookingType: 'ONLINE', payment: { paymentMode: 'UPI', paymentStatus: 'SUCCESS' } },
  { bookingId: 'BK-D4E5F6', hotel: { hotelName: 'Goa Beach Resort', city: 'Goa' }, hotelRoomType: { roomTypeName: 'Sea View Suite' }, startDate: '2026-03-01', endDate: '2026-03-05', finalAmount: 19200, bookingStatus: 'COMPLETED', bookingType: 'ONLINE', payment: { paymentMode: 'CARD', paymentStatus: 'SUCCESS' } },
  { bookingId: 'BK-G7H8I9', hotel: { hotelName: 'Jaipur Heritage Villa', city: 'Jaipur' }, hotelRoomType: { roomTypeName: 'Heritage Room' }, startDate: '2026-05-20', endDate: '2026-05-23', finalAmount: 33075, bookingStatus: 'CREATED', bookingType: 'ONLINE', payment: { paymentMode: 'NET_BANKING', paymentStatus: 'PENDING' } },
]

const NAV_ITEMS = [
  { id: 'bookings', label: 'My Bookings', icon: <Calendar size={16} /> },
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'preferences', label: 'Preferences', icon: <Settings size={16} /> },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getMyBookings()
        setBookings(res.data)
      } catch {
        setBookings(MOCK_BOOKINGS)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(bookingId)
    try {
      await cancelBooking(bookingId)
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b))
    } catch {
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b))
    } finally {
      setCancellingId(null)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const upcomingCount = bookings.filter(b => ['CREATED', 'CONFIRMED'].includes(b.bookingStatus)).length
  const completedCount = bookings.filter(b => b.bookingStatus === 'COMPLETED').length
  const totalSpent = bookings.filter(b => b.bookingStatus !== 'CANCELLED').reduce((sum, b) => sum + (b.finalAmount || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-4">
              <div className="flex items-center gap-3 mb-5">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center text-white font-bold font-display text-lg">
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-display font-bold text-brand-dark">{user?.fullName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {NAV_ITEMS.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {item.icon} {item.label}
                  </button>
                ))}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-brand-red transition-all">
                  <LogOut size={16} /> Sign Out
                </button>
              </nav>
            </div>

            {/* Stats */}
            <div className="card p-5 space-y-4">
              {[
                { label: 'Upcoming Trips', value: upcomingCount, color: 'text-brand-red' },
                { label: 'Trips Completed', value: completedCount, color: 'text-green-600' },
                { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, color: 'text-brand-dark' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{stat.label}</span>
                  <span className={`font-display font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-brand-dark">My Bookings</h2>
                  <button onClick={() => navigate('/hotels')} className="btn-primary text-sm py-2 px-4">+ New Booking</button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-brand-red" /></div>
                ) : bookings.length === 0 ? (
                  <div className="card p-16 text-center">
                    <div className="text-5xl mb-4">🏨</div>
                    <h3 className="font-display text-lg font-bold text-brand-dark mb-2">No bookings yet</h3>
                    <p className="text-gray-500 text-sm mb-6">Start exploring hotels and book your next stay.</p>
                    <button onClick={() => navigate('/hotels')} className="btn-primary">Browse Hotels</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => {
                      const statusCfg = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.CREATED
                      const canCancel = ['CREATED', 'CONFIRMED'].includes(booking.bookingStatus)
                      const nights = Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)))
                      return (
                        <div key={booking.bookingId} className="card p-6 animate-fade-up">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-display font-bold text-brand-dark text-lg">{booking.hotel?.hotelName}</h3>
                                <span className={`badge text-xs ${statusCfg.color}`}>{statusCfg.label}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                <MapPin size={11} />{booking.hotel?.city}
                              </div>
                            </div>
                            <span className="font-display font-bold text-brand-dark text-xl">₹{booking.finalAmount?.toLocaleString()}</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                            <div><p className="text-xs text-gray-400 mb-0.5">Room</p><p className="font-medium text-brand-dark">{booking.hotelRoomType?.roomTypeName}</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">Check-In</p><p className="font-medium text-brand-dark">{booking.startDate}</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">Check-Out</p><p className="font-medium text-brand-dark">{booking.endDate}</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">Duration</p><p className="font-medium text-brand-dark">{nights} night{nights > 1 ? 's' : ''}</p></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span>#{booking.bookingId}</span>
                              <span>•</span>
                              <span>{booking.payment?.paymentMode}</span>
                              <span>•</span>
                              <span className={booking.payment?.paymentStatus === 'SUCCESS' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                                {booking.payment?.paymentStatus}
                              </span>
                            </div>
                            {canCancel && (
                              <button onClick={() => handleCancel(booking.bookingId)} disabled={cancellingId === booking.bookingId}
                                className="text-xs text-brand-red border border-brand-red px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
                                {cancellingId === booking.bookingId ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="card p-8 animate-fade-up">
                <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'Full Name', value: user?.fullName, key: 'fullName' },
                    { label: 'Email', value: user?.email, key: 'email' },
                    { label: 'Phone Number', value: user?.phoneNumber || 'Not provided', key: 'phoneNumber' },
                    { label: 'Sign-in Method', value: user?.provider || 'SELF', key: 'provider' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{field.label}</label>
                      <input type="text" defaultValue={field.value} className="input-field" readOnly={field.key === 'provider'} />
                    </div>
                  ))}
                </div>
                <button className="btn-primary mt-6 px-8 py-3 text-sm">Save Changes</button>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="card p-8 animate-fade-up">
                <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Travel Preferences</h2>
                <p className="text-sm text-gray-500 mb-6">Personalize your experience and get better recommendations.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'Preferred Language', key: 'preferredLanguage', options: ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu'] },
                    { label: 'Preferred Currency', key: 'preferredCurrency', options: ['INR', 'USD', 'EUR', 'GBP', 'AED'] },
                    { label: 'Property Type', key: 'preferredPropertyType', options: ['Hotel', 'Resort', 'Villa', 'Hostel', 'Boutique'] },
                    { label: 'Room Type', key: 'preferredRoomType', options: ['Standard', 'Deluxe', 'Suite', 'Family'] },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{field.label}</label>
                      <select className="input-field text-sm">
                        <option value="">Select {field.label}</option>
                        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Price Range</label>
                    <input type="text" placeholder="e.g. 2000-8000" className="input-field text-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mt-5">
                  <div>
                    <p className="text-sm font-semibold text-brand-dark">Newsletter Subscription</p>
                    <p className="text-xs text-gray-500">Get exclusive deals and travel tips</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-brand-red after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                  </label>
                </div>
                <button className="btn-primary mt-6 px-8 py-3 text-sm">Save Preferences</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
