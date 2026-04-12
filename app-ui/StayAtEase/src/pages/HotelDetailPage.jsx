import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getHotelById, getHotelRoomTypes } from '../api/hotels'
import StarRating from '../components/common/StarRating'
import { MapPin, Clock, Users, BedDouble, Ruler, ChevronLeft, Loader2, Wifi, Car, Coffee, Dumbbell, Waves, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { checkRoomAvailability } from '../api/hotels'

const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',
]

const MOCK_HOTEL = {
  hotelId: 'H001', hotelName: 'The Grand Mumbai', hotelDescription: 'Experience unmatched luxury in the heart of Mumbai. With breathtaking sea views, world-class dining, and impeccable service, The Grand Mumbai redefines hospitality.',
  city: 'Mumbai', state: 'Maharashtra', country: 'India', addressLine1: 'Nariman Point', addressLine2: 'Marine Drive', pincode: '400021',
  hotelType: 'Hotel', starRating: 5, avgRating: 4.8, totalReviews: 1240, totalRooms: 250, checkInTime: '14:00', checkOutTime: '12:00',
  documents: [], status: 'ACTIVE'
}

const MOCK_ROOM_TYPES = [
  { roomTypeId: 'RT001', roomTypeName: 'Deluxe Room', totalRooms: 50, basePrice: 8500, discountPercentage: 15, finalPrice: 7225, currency: 'INR', maxAdults: 2, maxChildren: 1, bedCount: 1, bedType: 'KING', roomSizeSqFt: 380, status: 'ACTIVE' },
  { roomTypeId: 'RT002', roomTypeName: 'Premium Suite', totalRooms: 20, basePrice: 15000, discountPercentage: 10, finalPrice: 13500, currency: 'INR', maxAdults: 2, maxChildren: 2, bedCount: 1, bedType: 'KING', roomSizeSqFt: 620, status: 'ACTIVE' },
  { roomTypeId: 'RT003', roomTypeName: 'Family Room', totalRooms: 30, basePrice: 12000, discountPercentage: 5, finalPrice: 11400, currency: 'INR', maxAdults: 4, maxChildren: 2, bedCount: 2, bedType: 'QUEEN', roomSizeSqFt: 520, status: 'ACTIVE' },
]

const AMENITIES = [
  { icon: <Wifi size={16} />, label: 'Free WiFi' },
  { icon: <Car size={16} />, label: 'Parking' },
  { icon: <Coffee size={16} />, label: 'Breakfast' },
  { icon: <Dumbbell size={16} />, label: 'Gym' },
  { icon: <Waves size={16} />, label: 'Pool' },
  { icon: <Star size={16} />, label: 'Spa' },
]

export default function HotelDetailPage() {
  const { hotelId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const [hotel, setHotel] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [dates, setDates] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || 1,
  })

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const [hotelRes, roomsRes] = await Promise.all([getHotelById(hotelId), getHotelRoomTypes(hotelId)])
        setHotel(hotelRes.data)
        setRoomTypes(roomsRes.data)
      } catch {
        setHotel(MOCK_HOTEL)
        setRoomTypes(MOCK_ROOM_TYPES)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [hotelId])

  const handleBook = async (room) => {
    if (!user) { navigate('/auth'); return }

    if (!dates.checkIn || !dates.checkOut) {
      alert('Please select check-in and check-out dates before booking.')
      return
    }

    if (new Date(dates.checkOut) <= new Date(dates.checkIn)) {
      alert('Check-out date must be after check-in date.')
      return
    }

    try {
      const res = await checkRoomAvailability(hotelId, room.roomTypeId, dates.checkIn, dates.checkOut)
      if (!res.data.available) {
        alert('Sorry, this room is not available for the selected dates.')
        return
      }
    } catch(err) {
      // if check fails, let booking proceed and backend will validate
      console.log('Availability check error:', err) // ← add this
    }

    const params = new URLSearchParams({
      hotelId, roomTypeId: room.roomTypeId,
      checkIn: dates.checkIn, checkOut: dates.checkOut, guests: dates.guests,
    })
    navigate(`/booking?${params.toString()}`)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 size={32} className="animate-spin text-brand-red" />
    </div>
  )

  if (!hotel) return <div className="text-center py-20 text-gray-500">Hotel not found.</div>

  const images = hotel.documents?.length > 0
    ? hotel.documents.map(d => d.documentLink)
    : PLACEHOLDER_IMGS

  return (
    <div className="min-h-screen bg-white">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-red transition-colors mb-4">
          <ChevronLeft size={16} /> Back to results
        </button>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-3 gap-3 h-80 rounded-2xl overflow-hidden">
          <div className="col-span-2 bg-gray-100">
            <img src={images[selectedImg]} alt={hotel.hotelName} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-3">
            {images.slice(1, 3).map((img, i) => (
              <div key={i} onClick={() => setSelectedImg(i + 1)}
                className="flex-1 bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left — Hotel Info */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="badge bg-brand-red/10 text-brand-red mb-2">{hotel.hotelType}</span>
              <h1 className="font-display text-3xl font-bold text-brand-dark">{hotel.hotelName}</h1>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-0.5">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-bold text-brand-dark">{hotel.avgRating}</span>
              </div>
              <span className="text-xs text-gray-400">{hotel.totalReviews?.toLocaleString()} reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
            <MapPin size={14} className="text-brand-red" />
            {hotel.addressLine1}{hotel.addressLine2 ? `, ${hotel.addressLine2}` : ''}, {hotel.city}, {hotel.state} — {hotel.pincode}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <StarRating rating={hotel.starRating} />
            <span className="text-sm text-gray-400">{hotel.starRating}-Star Property</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{hotel.hotelDescription}</p>

          {/* Quick info */}
          <div className="flex gap-6 bg-gray-50 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={15} className="text-brand-red" />
              <span>Check-in: <strong>{hotel.checkInTime || '14:00'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={15} className="text-gray-400" />
              <span>Check-out: <strong>{hotel.checkOutTime || '12:00'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BedDouble size={15} className="text-gray-400" />
              <span><strong>{hotel.totalRooms}</strong> rooms total</span>
            </div>
          </div>

          {/* Amenities */}
          <h2 className="font-display text-xl font-bold text-brand-dark mb-4">Amenities</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10">
            {AMENITIES.map(a => (
              <div key={a.label} className="flex flex-col items-center gap-2 bg-gray-50 rounded-xl py-3 px-2 text-center">
                <div className="text-brand-red">{a.icon}</div>
                <span className="text-xs text-gray-600 font-medium">{a.label}</span>
              </div>
            ))}
          </div>

          {/* Room Types */}
          <h2 className="font-display text-xl font-bold text-brand-dark mb-5">Available Room Types</h2>
          <div className="space-y-4">
            {roomTypes.map(room => (
              <div key={room.roomTypeId}
                onClick={() => setSelectedRoom(selectedRoom?.roomTypeId === room.roomTypeId ? null : room)}
                className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${selectedRoom?.roomTypeId === room.roomTypeId ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-brand-dark text-lg mb-2">{room.roomTypeName}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users size={12} /> {room.maxAdults} Adults, {room.maxChildren} Kids</span>
                      <span className="flex items-center gap-1"><BedDouble size={12} /> {room.bedCount} {room.bedType} Bed</span>
                      <span className="flex items-center gap-1"><Ruler size={12} /> {room.roomSizeSqFt} sq ft</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    {room.discountPercentage > 0 && (
                      <div className="flex items-center gap-2 justify-end mb-0.5">
                        <span className="text-xs text-gray-400 line-through">₹{room.basePrice?.toLocaleString()}</span>
                        <span className="badge bg-green-100 text-green-700">{room.discountPercentage}% off</span>
                      </div>
                    )}
                    <span className="font-display text-2xl font-bold text-brand-dark">₹{room.finalPrice?.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 block">/night</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBook(room) }}
                      className="mt-3 btn-primary text-sm py-2 px-4"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Sticky booking widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 card p-6 border border-gray-200">
            <h3 className="font-display font-bold text-brand-dark text-lg mb-5">Plan Your Stay</h3>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Check-In</label>
              <input type="date" value={dates.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDates({ ...dates, checkIn: e.target.value })}
                className="input-field text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Check-Out</label>
              <input type="date" value={dates.checkOut}
                min={dates.checkIn || new Date().toISOString().split('T')[0]}
                onChange={e => setDates({ ...dates, checkOut: e.target.value })}
                className="input-field text-sm" />
            </div>

            {selectedRoom && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-brand-red mb-1">Selected Room</p>
                <p className="font-display font-bold text-brand-dark">{selectedRoom.roomTypeName}</p>
                <p className="text-brand-dark font-bold text-lg mt-1">₹{selectedRoom.finalPrice?.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/night</span></p>
              </div>
            )}

            <button
              onClick={() => selectedRoom ? handleBook(selectedRoom) : null}
              disabled={!selectedRoom}
              className={`w-full font-semibold py-3.5 rounded-xl transition-all mt-3 ${selectedRoom ? 'btn-primary' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >

              {selectedRoom ? 'Continue to Booking' : 'Select a Room Type'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">No payment charged yet</p>
          </div>
        </div>
      </div>
      <div className="h-20" />
    </div>
  )
}
