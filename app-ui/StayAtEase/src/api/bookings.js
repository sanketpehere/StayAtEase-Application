import api from './client'

// POST — create a new booking
export const createBooking = (payload) => api.post('/bookings', payload)

// GET — get all bookings for logged in customer
export const getMyBookings = () => api.get('/bookings/my')

// GET — get booking by bookingId
export const getBookingById = (bookingId) => api.get(`/bookings/${bookingId}`)

// PUT — cancel a booking
export const cancelBooking = (bookingId) => api.put(`/bookings/${bookingId}/cancel`)