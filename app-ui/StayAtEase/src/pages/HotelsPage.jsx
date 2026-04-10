import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchHotels } from '../api/hotels'
import StarRating from '../components/common/StarRating'
import { MapPin, Search, SlidersHorizontal, X, Loader2, Star, Users, ChevronDown } from 'lucide-react'

const HOTEL_TYPES = ['Hotel', 'Resort', 'Villa', 'Hostel', 'Boutique']
const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
]

// Mock hotel data for UI until backend hotel search endpoint is ready
const MOCK_HOTELS = [
  { hotelId: 'H001', hotelName: 'The Grand Mumbai', city: 'Mumbai', state: 'Maharashtra', hotelType: 'Hotel', starRating: 5, avgRating: 4.8, totalReviews: 1240, basePrice: 8500, finalPrice: 7200, addressLine1: 'Nariman Point', documents: [] },
  { hotelId: 'H002', hotelName: 'Goa Beach Resort', city: 'Goa', state: 'Goa', hotelType: 'Resort', starRating: 4, avgRating: 4.5, totalReviews: 876, basePrice: 5500, finalPrice: 4800, addressLine1: 'Calangute Beach', documents: [] },
  { hotelId: 'H003', hotelName: 'Jaipur Heritage Villa', city: 'Jaipur', state: 'Rajasthan', hotelType: 'Villa', starRating: 4, avgRating: 4.7, totalReviews: 432, basePrice: 12000, finalPrice: 10500, addressLine1: 'Civil Lines', documents: [] },
  { hotelId: 'H004', hotelName: 'Delhi Business Suites', city: 'Delhi', state: 'Delhi', hotelType: 'Hotel', starRating: 3, avgRating: 4.1, totalReviews: 654, basePrice: 3200, finalPrice: 2800, addressLine1: 'Connaught Place', documents: [] },
  { hotelId: 'H005', hotelName: 'Manali Mountain Lodge', city: 'Manali', state: 'Himachal Pradesh', hotelType: 'Boutique', starRating: 3, avgRating: 4.6, totalReviews: 289, basePrice: 4500, finalPrice: 3900, addressLine1: 'Mall Road', documents: [] },
  { hotelId: 'H006', hotelName: 'Udaipur Lake Palace', city: 'Udaipur', state: 'Rajasthan', hotelType: 'Resort', starRating: 5, avgRating: 4.9, totalReviews: 2100, basePrice: 18000, finalPrice: 15500, addressLine1: 'Pichola Lake', documents: [] },
]

const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=600&q=80',
]

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState('recommended')
  const [sortOpen, setSortOpen] = useState(false)

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '',
  })

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true)
      try {
        const res = await searchHotels(Object.fromEntries(searchParams.entries()))
        setHotels(res.data)
      } catch {
        // Use mock data when backend isn't ready
        let filtered = [...MOCK_HOTELS]
        if (filters.city) filtered = filtered.filter(h => h.city.toLowerCase().includes(filters.city.toLowerCase()))
        if (filters.type) filtered = filtered.filter(h => h.hotelType === filters.type)
        setHotels(filtered)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [searchParams])

  const applyFilters = () => {
    const params = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params)
    setFiltersOpen(false)
  }

  const clearFilter = (key) => {
    const updated = { ...filters, [key]: '' }
    setFilters(updated)
    const params = {}
    Object.entries(updated).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params)
  }

  const activeFilters = Object.entries(filters).filter(([, v]) => v)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top search bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
            <MapPin size={15} className="text-brand-red shrink-0" />
            <input
              type="text" placeholder="City, hotel name..." value={filters.city}
              onChange={e => setFilters({ ...filters, city: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
          </div>
          <button onClick={applyFilters} className="btn-primary flex items-center gap-2 py-2.5 text-sm">
            <Search size={14} /> Search
          </button>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 border-2 border-gray-200 hover:border-brand-red text-gray-600 hover:text-brand-red rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          >
            <SlidersHorizontal size={14} /> Filters
            {activeFilters.length > 0 && (
              <span className="bg-brand-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilters.length}</span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-brand-red transition-all"
            >
              {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
              <ChevronDown size={13} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[180px]">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${sortBy === opt.value ? 'text-brand-red font-medium' : 'text-gray-700'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-4">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Property Type</label>
                <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}
                  className="input-field text-sm">
                  <option value="">All Types</option>
                  {HOTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Price (₹)</label>
                <input type="number" placeholder="0" value={filters.minPrice}
                  onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input-field text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Max Price (₹)</label>
                <input type="number" placeholder="50000" value={filters.maxPrice}
                  onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input-field text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Rating</label>
                <select value={filters.minRating} onChange={e => setFilters({ ...filters, minRating: e.target.value })}
                  className="input-field text-sm">
                  <option value="">Any</option>
                  {[3, 3.5, 4, 4.5].map(r => <option key={r} value={r}>{r}+</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={applyFilters} className="btn-primary w-full text-sm py-2.5">Apply</button>
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="px-6 pb-3 flex gap-2 flex-wrap max-w-7xl mx-auto">
            {activeFilters.map(([key, val]) => (
              <span key={key} className="flex items-center gap-1.5 bg-red-50 text-brand-red text-xs font-medium px-3 py-1.5 rounded-full border border-red-200">
                {key}: {val}
                <button onClick={() => clearFilter(key)}><X size={11} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-brand-red" />
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏨</div>
            <h3 className="font-display text-xl font-bold text-brand-dark mb-2">No hotels found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters or searching a different city.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6 font-medium">{hotels.length} properties found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, idx) => (
                <div key={hotel.hotelId}
                  onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
                  className="card cursor-pointer overflow-hidden group animate-fade-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={hotel.documents?.[0]?.documentLink || PLACEHOLDER_IMGS[idx % PLACEHOLDER_IMGS.length]}
                      alt={hotel.hotelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge bg-white text-brand-dark shadow text-xs">{hotel.hotelType}</span>
                    </div>
                    {hotel.starRating >= 4 && (
                      <div className="absolute top-3 right-3">
                        <span className="badge bg-brand-red text-white text-xs">⭐ {hotel.starRating}-Star</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-brand-dark text-lg mb-1 line-clamp-1 group-hover:text-brand-red transition-colors">
                      {hotel.hotelName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                      <MapPin size={11} />
                      {hotel.addressLine1}, {hotel.city}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <StarRating rating={hotel.avgRating} size={12} />
                      <span className="text-xs font-semibold text-gray-700">{hotel.avgRating}</span>
                      <span className="text-xs text-gray-400">({hotel.totalReviews?.toLocaleString()} reviews)</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        {hotel.basePrice && hotel.finalPrice && hotel.basePrice !== hotel.finalPrice && (
                          <span className="text-xs text-gray-400 line-through block">₹{hotel.basePrice?.toLocaleString()}</span>
                        )}
                        <span className="text-xl font-display font-bold text-brand-dark">
                          ₹{(hotel.finalPrice || hotel.basePrice)?.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400"> /night</span>
                      </div>
                      <button className="bg-brand-red text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        View Rooms
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
