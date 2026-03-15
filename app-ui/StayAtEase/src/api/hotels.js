import api from './client'

export const searchHotels = (params) => api.get('/hotels/search', { params })
export const getHotelById = (hotelId) => api.get(`/hotels/${hotelId}`)
export const getHotelRoomTypes = (hotelId) => api.get(`/hotels/${hotelId}/room-types`)
