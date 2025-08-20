# X-Pay Investment Platform

A React-based investment platform with video monetization features.

## Features

- User authentication (email/phone verification)
- Investment batch management
- Video ad viewing system
- Referral program 
- Withdrawal system with different modes
- Admin dashboard

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS
- State Management: React Context
- Routing: React Router 7
- UI Components: Lucide React
- Animation: GSAP, AOS
- Form Handling: React Hook Form

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (create `.env` file)
4. Run dev server: `npm run dev`

## Detailed Documentation

- [Setup Guide](docs/SETUP.md)
- [Theme Management](docs/THEMES.md) 
- [API Reference](docs/API.md)
- [Usage Examples](docs/USAGE.md)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # Application state contexts
├── pages/          # Route-level components
├── services/       # API service layers
├── utils/          # Utility functions
└── assets/         # Static assets
