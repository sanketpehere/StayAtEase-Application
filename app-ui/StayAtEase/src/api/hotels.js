import api from './client'

export const getAllHotels = () => api.get('/hotels')
export const getHotelById = (hotelId) => api.get(`/hotels/${hotelId}`)
export const getHotelsByCity = (city) => api.get(`/hotels/search?city=${city}`)
export const searchHotels = (params) => {
  if (params.city) return api.get(`/hotels/search?city=${params.city}`)
  return api.get('/hotels')
}

// Room types for a specific hotel
export const getHotelRoomTypes = (hotelId) => api.get(`/hotels/${hotelId}/room-types`)
export const checkRoomAvailability = (hotelId, roomTypeId, checkIn, checkOut) =>
  api.get(`/hotels/${hotelId}/room-types/${roomTypeId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`)