# StayAtEase — Frontend (app-ui)

React + Tailwind CSS frontend for the StayAtEase hotel booking platform.

## Tech Stack
- **React 18** + **React Router v6**
- **Tailwind CSS** for styling
- **Axios** for API calls (proxied to Spring Boot at `:7803`)
- **@react-oauth/google** for Google Sign-In

## Project Structure
```
app-ui/
├── src/
│   ├── api/            # Axios API modules (auth, hotels, bookings)
│   ├── components/
│   │   └── common/     # Navbar, Footer, ProtectedRoute, StarRating
│   ├── context/        # AuthContext (global user state)
│   ├── pages/          # All page components
│   │   ├── HomePage.jsx
│   │   ├── AuthPage.jsx        # Login + Signup + Google OAuth
│   │   ├── HotelsPage.jsx      # Search & listing
│   │   ├── HotelDetailPage.jsx # Hotel detail + room selection
│   │   ├── BookingPage.jsx     # Booking form + payment
│   │   ├── DashboardPage.jsx   # Customer dashboard
│   │   └── NotFoundPage.jsx
│   ├── App.jsx          # Router
│   └── main.jsx         # Entry point with GoogleOAuthProvider
├── .env.example
├── vite.config.js       # Proxy → http://localhost:7803
└── package.json
```

## Setup

### 1. Install dependencies
```bash
cd app-ui
npm install
```

### 2. Configure Google OAuth
```bash
cp .env.example .env
# Edit .env and set your VITE_GOOGLE_CLIENT_ID
```

Get your Client ID from [Google Cloud Console](https://console.cloud.google.com):
- Create OAuth 2.0 credentials
- Add `http://localhost:3000` as an authorized origin
- Add `http://localhost:3000` as an authorized redirect URI

### 3. Start the frontend
```bash
npm run dev
```
App runs at **http://localhost:3000**

> Make sure your Spring Boot backend is running at port **7803** before starting the frontend.

## API Endpoints Used
| Frontend Action | Backend Endpoint |
|---|---|
| Email signup | `POST /api/v1/auth/ui/signup` |
| Google signup | `POST /api/v1/auth/social/signup` |
| Search hotels | `GET /api/v1/hotels/search` |
| Hotel detail | `GET /api/v1/hotels/:id` |
| Room types | `GET /api/v1/hotels/:id/room-types` |
| Create booking | `POST /api/v1/bookings` |
| My bookings | `GET /api/v1/bookings/my` |
| Cancel booking | `PUT /api/v1/bookings/:id/cancel` |

## Notes
- Pages fall back to **mock data** when the backend endpoint isn't implemented yet — so you can develop the UI independently.
- All API calls are proxied through Vite's dev server, so no CORS issues in development.
