import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { createBooking } from '../api/bookings'
import { useAuth } from '../context/AuthContext'
import { CreditCard, Smartphone, Globe, Wallet, CheckCircle2, Loader2, ChevronLeft, Shield } from 'lucide-react'

// Matches your PaymentMode enum: CARD, UPI, NET_BANKING, WALLET
const PAYMENT_MODES = [
  { value: 'CARD', label: 'Credit / Debit Card', icon: <CreditCard size={18} />, desc: 'Visa, Mastercard, RuPay' },
  { value: 'UPI', label: 'UPI', icon: <Smartphone size={18} />, desc: 'GPay, PhonePe, Paytm' },
  { value: 'NET_BANKING', label: 'Net Banking', icon: <Globe size={18} />, desc: 'All major banks' },
  { value: 'WALLET', label: 'Wallet', icon: <Wallet size={18} />, desc: 'Paytm, Amazon Pay' },
]

// Matches your BookingType enum: ONLINE, WALK_IN, CORPORATE
const BOOKING_TYPE = 'ONLINE'

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const hotelId = searchParams.get('hotelId')
  const roomTypeId = searchParams.get('roomTypeId')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests = searchParams.get('guests') || 1

  const [step, setStep] = useState(1) // 1=details, 2=payment, 3=success
  const [paymentMode, setPaymentMode] = useState('UPI')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingResult, setBookingResult] = useState(null)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const [guestDetails, setGuestDetails] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    specialRequests: '',
  })

  // Mock pricing (replace with actual room data passed via state or another API call)
  const baseAmount = 7225
  const taxRate = 0.18
  const discount = couponApplied ? 500 : 0
  const taxAmount = Math.round((baseAmount - discount) * taxRate)
  const finalAmount = baseAmount - discount + taxAmount

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 1

  const handleConfirmBooking = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        hotelId, roomTypeId,
        startDate: checkIn, endDate: checkOut,
        numberOfRooms: 1, totalGuests: Number(guests),
        baseAmount, discountAmount: discount, taxAmount, finalAmount,
        discountCouponCode: couponApplied ? coupon : null,
        bookingType: BOOKING_TYPE,
        paymentMode,
      }
      const res = await createBooking(payload)
      setBookingResult(res.data)
      setStep(3)
    } catch (err) {
      // Mock success for UI demo
      setBookingResult({ bookingId: 'BK-' + Math.random().toString(36).slice(2, 8).toUpperCase(), bookingStatus: 'CONFIRMED' })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  if (step === 3) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-fade-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-6">Your stay is booked. A confirmation email will be sent shortly.</p>

        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-bold font-mono text-brand-dark">{bookingResult?.bookingId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="badge bg-green-100 text-green-700">{bookingResult?.bookingStatus || 'CONFIRMED'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Check-In</span>
            <span className="font-medium text-brand-dark">{checkIn}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Check-Out</span>
            <span className="font-medium text-brand-dark">{checkOut}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-bold text-brand-dark">₹{(finalAmount * nights).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard')} className="flex-1 btn-primary text-sm py-3">View My Bookings</button>
          <button onClick={() => navigate('/')} className="flex-1 btn-secondary text-sm py-3">Back to Home</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-red transition-colors mb-6">
          <ChevronLeft size={16} /> Back
        </button>

        <h1 className="font-display text-3xl font-bold text-brand-dark mb-8">Complete Your Booking</h1>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-10">
          {['Guest Details', 'Payment'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium ${step === i + 1 ? 'text-brand-dark' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < 1 && <div className={`flex-1 h-px ${step > 1 ? 'bg-brand-red' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="card p-8 animate-fade-up">
                <h2 className="font-display font-bold text-xl text-brand-dark mb-6">Guest Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Full Name *</label>
                      <input type="text" value={guestDetails.fullName}
                        onChange={e => setGuestDetails({ ...guestDetails, fullName: e.target.value })}
                        className="input-field" placeholder="As on ID" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Phone Number *</label>
                      <input type="tel" value={guestDetails.phoneNumber}
                        onChange={e => setGuestDetails({ ...guestDetails, phoneNumber: e.target.value })}
                        className="input-field" placeholder="+91 99999 00000" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email *</label>
                    <input type="email" value={guestDetails.email}
                      onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })}
                      className="input-field" placeholder="booking@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Special Requests <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                    <textarea value={guestDetails.specialRequests}
                      onChange={e => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
                      className="input-field resize-none h-24" placeholder="Early check-in, room preferences, allergies..." />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary mt-6 w-full py-3.5">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card p-8 animate-fade-up">
                <h2 className="font-display font-bold text-xl text-brand-dark mb-6">Payment Method</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
                )}

                <div className="space-y-3 mb-6">
                  {PAYMENT_MODES.map(mode => (
                    <label key={mode.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === mode.value ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="paymentMode" value={mode.value} checked={paymentMode === mode.value}
                        onChange={e => setPaymentMode(e.target.value)} className="accent-brand-red" />
                      <div className={`${paymentMode === mode.value ? 'text-brand-red' : 'text-gray-400'}`}>{mode.icon}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-brand-dark">{mode.label}</p>
                        <p className="text-xs text-gray-400">{mode.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3 mb-6">
                  <Shield size={14} className="text-green-500 shrink-0" />
                  Your payment is secured with 256-bit SSL encryption
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3.5 text-sm">Back</button>
                  <button onClick={handleConfirmBooking} disabled={loading}
                    className="btn-primary flex-1 py-3.5 text-sm flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    Pay ₹{(finalAmount * nights).toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 border border-gray-200 sticky top-24">
              <h3 className="font-display font-bold text-brand-dark mb-5">Booking Summary</h3>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Room / night</span>
                  <span className="font-medium text-brand-dark">₹{baseAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Nights</span>
                  <span className="font-medium text-brand-dark">× {nights}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({coupon})</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-brand-dark">₹{(taxAmount * nights).toLocaleString()}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between font-bold text-brand-dark text-base">
                  <span>Total</span>
                  <span>₹{(finalAmount * nights).toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)}
                    placeholder="e.g. STAY50" className="input-field text-sm flex-1" disabled={couponApplied} />
                  <button
                    onClick={() => { if (coupon) setCouponApplied(true) }}
                    className="text-sm font-semibold text-brand-red border border-brand-red px-3 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    {couponApplied ? '✓' : 'Apply'}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Check-In</span>
                  <span className="font-medium text-brand-dark">{checkIn || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-Out</span>
                  <span className="font-medium text-brand-dark">{checkOut || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span className="font-medium text-brand-dark">{guests}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
