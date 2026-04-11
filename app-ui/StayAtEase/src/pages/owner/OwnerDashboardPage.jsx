import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/client'
import { Building2, CalendarDays, DollarSign, LogOut, Plus, MapPin, Loader2, BedDouble, Users, TrendingUp } from 'lucide-react'

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
  CREATED:   { label: 'Created',   color: 'bg-blue-100 text-blue-700' },
}

export default function OwnerDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [hotels, setHotels] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddHotel, setShowAddHotel] = useState(false)
  const [hotelForm, setHotelForm] = useState({
    hotelName: '', hotelDescription: '', hotelType: '', starRating: 3,
    addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '',
    totalRooms: '', checkInTime: '14:00', checkOutTime: '11:00'
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [hotelsRes, bookingsRes] = await Promise.all([
        api.get('/owner/hotels'),
        api.get('/owner/bookings')
      ])
      setHotels(hotelsRes.data)
      setBookings(bookingsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleHotelFormChange = (e) => {
    setHotelForm({ ...hotelForm, [e.target.name]: e.target.value })
    setFormError('')
  }

  const handleCreateHotel = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')
    try {
      await api.post('/owner/hotels', {
        ...hotelForm,
        starRating: Number(hotelForm.starRating),
        totalRooms: Number(hotelForm.totalRooms),
      })
      setShowAddHotel(false)
      setHotelForm({
        hotelName: '', hotelDescription: '', hotelType: '', starRating: 3,
        addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '',
        totalRooms: '', checkInTime: '14:00', checkOutTime: '11:00'
      })
      fetchData()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create hotel.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const totalRevenue = bookings
    .filter(b => b.bookingStatus !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0)

  const totalBookings = bookings.filter(b => b.bookingStatus !== 'CANCELLED').length

  const HotelCard = ({ hotel }) => {
    const [expanded, setExpanded] = useState(false)
    const [roomTypes, setRoomTypes] = useState([])
    const [roomsLoading, setRoomsLoading] = useState(false)
    const [showAddRoom, setShowAddRoom] = useState(false)
    const [roomForm, setRoomForm] = useState({
      roomTypeName: '', totalRooms: '', basePrice: '', discountPercentage: 0,
      maxAdults: 2, maxChildren: 1, bedCount: 1, bedType: 'KING', roomSizeSqFt: ''
    })
    const [roomFormLoading, setRoomFormLoading] = useState(false)
    const [roomFormError, setRoomFormError] = useState('')

    const fetchRoomTypes = async () => {
      setRoomsLoading(true)
      try {
        const res = await api.get(`/owner/hotels/${hotel.hotelId}/room-types`)
        setRoomTypes(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setRoomsLoading(false)
      }
    }

    const handleExpand = () => {
      if (!expanded) fetchRoomTypes()
      setExpanded(!expanded)
    }

    const handleRoomFormChange = (e) => {
      setRoomForm({ ...roomForm, [e.target.name]: e.target.value })
      setRoomFormError('')
    }

    const handleAddRoomType = async (e) => {
      e.preventDefault()
      setRoomFormLoading(true)
      setRoomFormError('')
      try {
        await api.post(`/owner/hotels/${hotel.hotelId}/room-types`, {
          ...roomForm,
          totalRooms: Number(roomForm.totalRooms),
          basePrice: Number(roomForm.basePrice),
          discountPercentage: Number(roomForm.discountPercentage),
          maxAdults: Number(roomForm.maxAdults),
          maxChildren: Number(roomForm.maxChildren),
          bedCount: Number(roomForm.bedCount),
          roomSizeSqFt: Number(roomForm.roomSizeSqFt),
        })
        setShowAddRoom(false)
        setRoomForm({
          roomTypeName: '', totalRooms: '', basePrice: '', discountPercentage: 0,
          maxAdults: 2, maxChildren: 1, bedCount: 1, bedType: 'KING', roomSizeSqFt: ''
        })
        fetchRoomTypes()
      } catch (err) {
        setRoomFormError(err.response?.data?.message || 'Failed to add room type.')
      } finally {
        setRoomFormLoading(false)
      }
    }

    return (
      <div className="card p-6">
        {/* Hotel Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-brand-dark text-lg">{hotel.hotelName}</h3>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
              <MapPin size={11} /> {hotel.city}, {hotel.state}
            </div>
          </div>
          <span className="badge bg-green-100 text-green-700 text-xs">{hotel.status}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{hotel.hotelDescription}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><BedDouble size={11} /> {hotel.totalRooms} rooms</span>
            <span className="flex items-center gap-1"><Users size={11} /> {hotel.totalBookings} bookings</span>
          </div>
          <button onClick={handleExpand}
            className="text-sm text-brand-red font-medium hover:underline">
            {expanded ? 'Hide Rooms ▲' : 'Manage Rooms ▼'}
          </button>
        </div>

        {/* Room Types Panel */}
        {expanded && (
          <div className="mt-5 border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-brand-dark">Room Types</h4>
              <button onClick={() => setShowAddRoom(!showAddRoom)}
                className="flex items-center gap-1.5 text-sm btn-primary py-1.5 px-3">
                <Plus size={13} /> Add Room Type
              </button>
            </div>

            {/* Add Room Type Form */}
            {showAddRoom && (
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <h5 className="font-semibold text-brand-dark mb-4">New Room Type</h5>
                {roomFormError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2 mb-3">{roomFormError}</div>
                )}
                <form onSubmit={handleAddRoomType} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Room Type Name *</label>
                      <input type="text" name="roomTypeName" value={roomForm.roomTypeName}
                        onChange={handleRoomFormChange} className="input-field text-sm" required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Total Rooms *</label>
                      <input type="number" name="totalRooms" value={roomForm.totalRooms}
                        onChange={handleRoomFormChange} className="input-field text-sm" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Base Price (₹) *</label>
                      <input type="number" name="basePrice" value={roomForm.basePrice}
                        onChange={handleRoomFormChange} className="input-field text-sm" required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Discount (%)</label>
                      <input type="number" name="discountPercentage" value={roomForm.discountPercentage}
                        onChange={handleRoomFormChange} className="input-field text-sm" min="0" max="100" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Max Adults</label>
                      <input type="number" name="maxAdults" value={roomForm.maxAdults}
                        onChange={handleRoomFormChange} className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Max Children</label>
                      <input type="number" name="maxChildren" value={roomForm.maxChildren}
                        onChange={handleRoomFormChange} className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Bed Count</label>
                      <input type="number" name="bedCount" value={roomForm.bedCount}
                        onChange={handleRoomFormChange} className="input-field text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Bed Type</label>
                      <select name="bedType" value={roomForm.bedType}
                        onChange={handleRoomFormChange} className="input-field text-sm">
                        {['KING', 'QUEEN', 'TWIN', 'SINGLE'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Room Size (sq ft)</label>
                      <input type="number" name="roomSizeSqFt" value={roomForm.roomSizeSqFt}
                        onChange={handleRoomFormChange} className="input-field text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="submit" disabled={roomFormLoading}
                      className="btn-primary text-sm py-2 px-6 flex items-center gap-2">
                      {roomFormLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                      Add Room Type
                    </button>
                    <button type="button" onClick={() => setShowAddRoom(false)}
                      className="btn-secondary text-sm py-2 px-6">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Room Types List */}
            {roomsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 size={20} className="animate-spin text-brand-red" />
              </div>
            ) : roomTypes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No room types added yet.</p>
            ) : (
              <div className="space-y-3">
                {roomTypes.map(room => (
                  <div key={room.roomTypeId} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div>
                      <p className="font-semibold text-brand-dark text-sm">{room.roomTypeName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {room.totalRooms} rooms · {room.maxAdults} adults · {room.bedCount} {room.bedType} bed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-dark">₹{room.finalPrice?.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">/night</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold">S</span>
            </div>
            <div>
              <span className="font-display font-bold text-brand-dark">StayAtEase</span>
              <span className="text-xs text-gray-400 ml-2">Owner Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hi, {user?.fullName}</span>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-red transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: <TrendingUp size={15} /> },
            { id: 'hotels', label: 'My Hotels', icon: <Building2 size={15} /> },
            { id: 'bookings', label: 'Bookings', icon: <CalendarDays size={15} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-brand-red text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-brand-red" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-fade-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Total Properties', value: hotels.length, icon: <Building2 size={20} />, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Total Bookings', value: totalBookings, icon: <CalendarDays size={20} />, color: 'text-green-600 bg-green-50' },
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'text-brand-red bg-red-50' },
                  ].map(stat => (
                    <div key={stat.label} className="card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">{stat.label}</span>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <p className="font-display text-3xl font-bold text-brand-dark">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent bookings */}
                <div className="card p-6">
                  <h3 className="font-display font-bold text-brand-dark text-lg mb-4">Recent Bookings</h3>
                  {bookings.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map(booking => {
                        const statusCfg = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.CREATED
                        return (
                          <div key={booking.bookingId} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <div>
                              <p className="font-medium text-brand-dark text-sm">{booking.hotel?.hotelName}</p>
                              <p className="text-xs text-gray-400">{booking.startDate} → {booking.endDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-brand-dark text-sm">₹{booking.finalAmount?.toLocaleString()}</p>
                              <span className={`badge text-xs ${statusCfg.color}`}>{statusCfg.label}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-brand-dark">My Hotels</h2>
                  <button onClick={() => setShowAddHotel(!showAddHotel)}
                    className="btn-primary flex items-center gap-2 text-sm py-2.5">
                    <Plus size={15} /> Add Hotel
                  </button>
                </div>

                {/* Add Hotel Form */}
                {showAddHotel && (
                  <div className="card p-8 mb-6 animate-fade-up">
                    <h3 className="font-display font-bold text-xl text-brand-dark mb-6">Add New Hotel</h3>
                    {formError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{formError}</div>
                    )}
                    <form onSubmit={handleCreateHotel} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Hotel Name *</label>
                          <input type="text" name="hotelName" value={hotelForm.hotelName}
                            onChange={handleHotelFormChange} className="input-field" required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Hotel Type *</label>
                          <select name="hotelType" value={hotelForm.hotelType}
                            onChange={handleHotelFormChange} className="input-field" required>
                            <option value="">Select Type</option>
                            {['LUXURY', 'RESORT', 'BOUTIQUE', 'HERITAGE', 'BEACH', 'BUDGET'].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description *</label>
                        <textarea name="hotelDescription" value={hotelForm.hotelDescription}
                          onChange={handleHotelFormChange} className="input-field resize-none h-24" required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Star Rating</label>
                          <select name="starRating" value={hotelForm.starRating}
                            onChange={handleHotelFormChange} className="input-field">
                            {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Total Rooms *</label>
                          <input type="number" name="totalRooms" value={hotelForm.totalRooms}
                            onChange={handleHotelFormChange} className="input-field" required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Check-In Time</label>
                          <input type="time" name="checkInTime" value={hotelForm.checkInTime}
                            onChange={handleHotelFormChange} className="input-field" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Address Line 1 *</label>
                          <input type="text" name="addressLine1" value={hotelForm.addressLine1}
                            onChange={handleHotelFormChange} className="input-field" required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Address Line 2</label>
                          <input type="text" name="addressLine2" value={hotelForm.addressLine2}
                            onChange={handleHotelFormChange} className="input-field" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">City *</label>
                          <input type="text" name="city" value={hotelForm.city}
                            onChange={handleHotelFormChange} className="input-field" required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">State *</label>
                          <input type="text" name="state" value={hotelForm.state}
                            onChange={handleHotelFormChange} className="input-field" required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Country</label>
                          <input type="text" name="country" value={hotelForm.country}
                            onChange={handleHotelFormChange} className="input-field" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Pincode</label>
                          <input type="text" name="pincode" value={hotelForm.pincode}
                            onChange={handleHotelFormChange} className="input-field" />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={formLoading}
                          className="btn-primary flex items-center gap-2 py-3 px-8">
                          {formLoading ? <Loader2 size={15} className="animate-spin" /> : null}
                          Create Hotel
                        </button>
                        <button type="button" onClick={() => setShowAddHotel(false)}
                          className="btn-secondary py-3 px-8">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Hotels List */}
                {hotels.length === 0 ? (
                  <div className="card p-16 text-center">
                    <div className="text-5xl mb-4">🏨</div>
                    <h3 className="font-display text-lg font-bold text-brand-dark mb-2">No hotels yet</h3>
                    <p className="text-gray-500 text-sm mb-6">Add your first property to get started.</p>
                    <button onClick={() => setShowAddHotel(true)} className="btn-primary">Add Hotel</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {hotels.map(hotel => (
                      <HotelCard
                        key={hotel.hotelId}
                        hotel={hotel}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="animate-fade-up">
                <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">All Bookings</h2>
                {bookings.length === 0 ? (
                  <div className="card p-16 text-center">
                    <p className="text-gray-400">No bookings yet across your properties.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => {
                      const statusCfg = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.CREATED
                      return (
                        <div key={booking.bookingId} className="card p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-display font-bold text-brand-dark">{booking.hotel?.hotelName}</h3>
                              <p className="text-xs text-gray-400">#{booking.bookingId}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-brand-dark">₹{booking.finalAmount?.toLocaleString()}</p>
                              <span className={`badge text-xs ${statusCfg.color}`}>{statusCfg.label}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 rounded-xl p-4">
                            <div><p className="text-xs text-gray-400">Room</p><p className="font-medium">{booking.hotelRoomType?.roomTypeName}</p></div>
                            <div><p className="text-xs text-gray-400">Check-In</p><p className="font-medium">{booking.startDate}</p></div>
                            <div><p className="text-xs text-gray-400">Check-Out</p><p className="font-medium">{booking.endDate}</p></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}