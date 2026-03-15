import api from './client'

export const createBooking = (data) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings/my')
export const getBookingById = (bookingId) => api.get(`/bookings/${bookingId}`)
export const cancelBooking = (bookingId) => api.put(`/bookings/${bookingId}/cancel`)
