import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-xl text-white">StayAtEase</span>
          </div>
          <p className="text-sm leading-relaxed">Your trusted partner for comfortable stays across India and beyond.</p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/hotels" className="hover:text-white transition-colors">Hotels</Link></li>
            <li><Link to="/hotels?type=Resort" className="hover:text-white transition-colors">Resorts</Link></li>
            <li><Link to="/hotels?type=Villa" className="hover:text-white transition-colors">Villas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Partner With Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 px-6 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} StayAtEase. All rights reserved.
      </div>
    </footer>
  )
}
