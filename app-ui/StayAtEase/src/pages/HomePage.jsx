import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Users, Search, Star, TrendingUp, Shield, Headphones } from 'lucide-react'

const POPULAR_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Manali', 'Udaipur', 'Kerala']

const HOTEL_TYPES = [
  { label: 'Hotels', icon: '🏨', value: 'Hotel' },
  { label: 'Resorts', icon: '🌴', value: 'Resort' },
  { label: 'Villas', icon: '🏡', value: 'Villa' },
  { label: 'Hostels', icon: '🛏️', value: 'Hostel' },
]

const FEATURES = [
  { icon: <TrendingUp size={22} />, title: 'Best Price Guarantee', desc: 'We match any price you find elsewhere.' },
  { icon: <Shield size={22} />, title: 'Verified Properties', desc: 'Every hotel is reviewed and approved by our team.' },
  { icon: <Headphones size={22} />, title: '24/7 Support', desc: 'Our team is available round the clock for you.' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState({ city: '', checkIn: '', checkOut: '', guests: 1 })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.city) params.set('city', search.city)
    if (search.checkIn) params.set('checkIn', search.checkIn)
    if (search.checkOut) params.set('checkOut', search.checkOut)
    if (search.guests) params.set('guests', search.guests)
    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-brand-dark overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-blue opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-36">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
              <Star size={12} className="fill-amber-400 text-amber-400" /> Trusted by 50,000+ travelers
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Find Your Perfect<br />
              <span className="text-brand-red">Stay</span> Today
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              Discover thousands of hotels, resorts, and villas across India. Book instantly with the best prices guaranteed.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch}
            className="bg-white rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row gap-3 max-w-4xl animate-fade-up"
            style={{ animationDelay: '0.1s' }}>
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
              <MapPin size={16} className="text-brand-red shrink-0" />
              <input
                type="text" placeholder="Where are you going?"
                value={search.city}
                onChange={e => setSearch({ ...search, city: e.target.value })}
                className="w-full text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 min-w-[140px]">
              <Calendar size={16} className="text-brand-red shrink-0" />
              <input
                type="date" value={search.checkIn}
                onChange={e => setSearch({ ...search, checkIn: e.target.value })}
                className="w-full text-sm outline-none text-gray-600"
              />
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 min-w-[140px]">
              <Calendar size={16} className="text-gray-400 shrink-0" />
              <input
                type="date" value={search.checkOut}
                onChange={e => setSearch({ ...search, checkOut: e.target.value })}
                className="w-full text-sm outline-none text-gray-600"
              />
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 min-w-[120px]">
              <Users size={16} className="text-gray-400 shrink-0" />
              <input
                type="number" min={1} max={20} value={search.guests}
                onChange={e => setSearch({ ...search, guests: e.target.value })}
                className="w-full text-sm outline-none text-gray-600"
                placeholder="Guests"
              />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
              <Search size={16} /> Search Hotels
            </button>
          </form>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="max-w-7xl mx-auto -mt-[4.5rem] px-6 -mt-10 relative z-10">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {POPULAR_CITIES.map(city => (
            <button key={city}
              onClick={() => navigate(`/hotels?city=${city}`)}
              className="shrink-0 bg-white border border-gray-200 text-sm font-medium text-gray-700 px-5 py-2.5 rounded-full shadow-sm hover:border-brand-red hover:text-brand-red transition-all"
            >
              {city}
            </button>
          ))}
        </div>

      </section>

      {/* Property Types */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Browse by Type</h2>
        <p className="text-gray-500 text-sm mb-8">Find the accommodation style that suits your trip.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HOTEL_TYPES.map(type => (
            <button key={type.value}
              onClick={() => navigate(`/hotels?type=${type.value}`)}
              className="card p-6 text-center hover:border-brand-red border-2 border-transparent cursor-pointer group"
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <div className="font-display font-semibold text-brand-dark group-hover:text-brand-red transition-colors">{type.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-2xl font-bold text-brand-dark text-center mb-12">Why Choose StayAtEase?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-brand-dark mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-brand-dark rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red opacity-10 rounded-full blur-3xl" />
          <div className="z-10">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to find your stay?</h2>
            <p className="text-gray-400">Sign up today and get exclusive member deals.</p>
          </div>
          <div className="flex gap-3 z-10 shrink-0">
            <button onClick={() => navigate('/auth?mode=signup')} className="btn-primary">Get Started</button>
            <button onClick={() => navigate('/hotels')} className="btn-secondary border-white text-white hover:bg-white hover:text-brand-dark">Browse Hotels</button>
          </div>
        </div>
      </section>
    </div>
  )
}
