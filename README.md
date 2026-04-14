# StayAtEase

StayAtEase is a full-stack hotel booking platform with a React + Tailwind CSS frontend and a Spring Boot backend. It supports user sign-up, email verification, Google OAuth2 login, hotel search, room reservation, booking history, and booking cancellation.

## Overview

- Frontend: `app-ui/StayAtEase`
- Backend: `core-app`
- Project name: **StayAtEase**
- Staging frontend URL: https://stayatease-frontend-staging.onrender.com/
- Staging backend base URL used in frontend env: `https://stayatease-backend-staging.onrender.com/api/v1`
- Branch strategy:
  - `develop` — staging
  - `main` — production
- Two separate PostgreSQL databases: one for staging, one for production

## What’s included

- Customer authentication with email/password sign-up and Google social login
- Email verification workflow for customer accounts
- JWT-secured REST API using Spring Security
- Reactive frontend routing and protected pages
- Hotel search by city, hotel detail pages, room types, and availability checks
- Booking creation, booking list, booking detail, and booking cancellation
- Owner signup/login support for hotel owners
- Separate staging and production environments for code and database

## Tech Stack

- Frontend
  - React 18
  - React Router v6
  - Tailwind CSS
  - Vite
  - Axios
  - Google OAuth via `@react-oauth/google`
- Backend
  - Spring Boot 3.x
  - Spring Security
  - Spring Data JPA
  - JWT via `jjwt`
  - PostgreSQL
  - Spring Mail for email verification
  - `spring-dotenv` for environment config
  - Lombok for boilerplate reduction

## Repository Structure

```
StayAtEase/
├── app-ui/StayAtEase/     # React frontend
│   ├── public/             # Static assets
│   ├── src/                # UI components, pages, API modules, context
│   │   ├── api/            # Axios API clients
│   │   ├── components/     # UI and layout components
│   │   ├── context/        # Auth context and state
│   │   └── pages/          # App pages and routes
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                # local environment file
├── core-app/              # Spring Boot backend
│   ├── src/main/java/
│   │   ├── configuration/  # Security and filters
│   │   ├── controller/     # REST controllers
│   │   ├── models/         # JPA entities
│   │   ├── repository/     # Spring Data repositories
│   │   ├── requestDto/     # DTOs for auth and booking payloads
│   │   └── service/        # Business logic services
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── .gitignore
└── README.md              # This file
```

## Frontend Details

The frontend is built with Vite and React, and it includes:

- A global auth context for managing user state
- Protected routes for authenticated areas like bookings and dashboard
- Google OAuth integration for social sign-in
- Axios API modules for auth, hotels, and bookings
- Tailwind-styled pages for home, hotel listings, hotel details, booking flow, and dashboard

### Important frontend env variables

- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID
- `VITE_API_BASE_URL` — Base URL for backend API requests

Example `.env` values:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE_URL=https://stayatease-backend-staging.onrender.com/api/v1
```

### Frontend commands

```bash
cd app-ui/StayAtEase
npm install
npm run dev
npm run build
npm run preview
```

## Backend Details

The backend provides JWT-protected REST APIs and includes these controllers:

- `AuthController` — email login/signup, Google social signup, owner signup/login, email verification
- `HotelController` — list hotels, hotel detail, search hotels by city, room types, availability checks
- `BookingController` — create booking, customer booking history, booking detail, cancel booking
- `OwnerController` — owner-specific hotel management (if implemented)

### Security

- Stateless security with Spring Security and JWT
- CORS and CSRF disabled for API usage from the frontend
- Public endpoints: `/api/v1/auth/**`, `/api/v1/hotels/**`
- Protected endpoints: `/api/v1/bookings/**` and other customer-only routes

### Required backend env variables

```bash
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_HIBERNATE_AUTO_UPDATE_PROPERTY
JWT_SECRET
JWT_EXPIRATION
MAIL_USERNAME
MAIL_PASSWORD
```

The `application.properties` file reads these values and configures:

- PostgreSQL datasource
- Hibernate dialect and SQL logging
- JWT secret and expiration
- SMTP email settings for Gmail

### Backend commands

```bash
cd core-app
./mvnw spring-boot:run
./mvnw test
./mvnw clean package
```

## API Summary

| Area     | Endpoint                                                                                     | Notes                             |
| -------- | -------------------------------------------------------------------------------------------- | --------------------------------- |
| Auth     | `POST /api/v1/auth/ui/signup`                                                                | Customer registration             |
| Auth     | `POST /api/v1/auth/ui/login`                                                                 | Customer login                    |
| Auth     | `POST /api/v1/auth/social/signup`                                                            | Google OAuth signup               |
| Auth     | `GET /api/v1/auth/verify-email?token=...`                                                    | Email verification                |
| Auth     | `POST /api/v1/auth/owner/signup`                                                             | Owner registration                |
| Auth     | `POST /api/v1/auth/owner/login`                                                              | Owner login                       |
| Hotels   | `GET /api/v1/hotels`                                                                         | List active hotels                |
| Hotels   | `GET /api/v1/hotels/{hotelId}`                                                               | Hotel details                     |
| Hotels   | `GET /api/v1/hotels/search?city=...`                                                         | Search hotels by city             |
| Hotels   | `GET /api/v1/hotels/{hotelId}/room-types`                                                    | Get available room types          |
| Hotels   | `GET /api/v1/hotels/{hotelId}/room-types/{roomTypeId}/availability?checkIn=...&checkOut=...` | Check availability                |
| Bookings | `POST /api/v1/bookings`                                                                      | Create booking (authenticated)    |
| Bookings | `GET /api/v1/bookings/my`                                                                    | Customer bookings (authenticated) |
| Bookings | `GET /api/v1/bookings/{bookingId}`                                                           | Booking details                   |
| Bookings | `PUT /api/v1/bookings/{bookingId}/cancel`                                                    | Cancel booking                    |

## Deployment and Branching

- `develop` branch is used for staging deployments and testing.
- `main` branch is used for production-ready releases.
- Staging environment uses a separate PostgreSQL database from production.
- Frontend staging URL: https://stayatease-frontend-staging.onrender.com/

## Future Improvements

- Add a dedicated owner dashboard for hotel management
- Add payment integration for booking payments
- Improve email templates and verification UX
- Add unit/integration tests for frontend and backend
- Support search filters by dates, guests, and room amenities
