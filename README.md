# Trailer Rental App

A modern trailer rental platform built with Next.js 15+, TypeScript, and shadcn/ui components. This application connects trailer owners with customers, providing a comprehensive booking and management system.

## Features

### Core Functionality
- **Dual User Types**: Trailer owners and customers with distinct dashboards
- **Apple Sign-In Authentication**: Secure client-side authentication
- **Booking System**: Date-based reservations with pickup/delivery options
- **Trailer Management**: Owner approval/denial system for rental requests
- **Pricing Structure**: Per-day costs (non-refundable) + deposits (refundable)
- **Cash Payment System**: Simple payment tracking

### Technical Features
- Modern UI components built with accessibility and responsiveness
- Radix UI for accessibility-first component logic
- Tailwind CSS with custom variables for styling and theming
- TypeScript for type-safe development
- React Hook Form for advanced form management
- Mobile-responsive design and interaction
- Turbopack enabled for faster development builds

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Apple Authentication (Client-Side)
APPLE_CLIENT_ID=your_apple_service_id_here

# Future Integrations (Currently Disabled - Placeholders)
# ITSME_CLIENT_ID=your_itsme_client_id
# ITSME_CLIENT_SECRET=your_itsme_client_secret
# EU_LICENSE_VERIFICATION_API_KEY=your_verification_api_key
```

### Authentication Systems

#### Currently Active
- **Apple Sign-In**: Client-side authentication for secure user login

#### Future Integrations (Placeholders)
- **itsme Authentication**: European identity verification service (disabled)
- **EU Driving License Verification**: Automated license validation (disabled)

*Note: The disabled authentication systems are designed for future legal, security, and privacy compliance requirements.*

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes for backend functionality
│   ├── customer/          # Customer-specific pages
│   ├── owner/             # Trailer owner pages
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable shadcn/ui components
│   ├── Auth/              # Authentication components
│   ├── Booking/           # Booking system components
│   └── TrailerManagement/ # Owner management components
├── context/               # React context providers
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions and database
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm / bun
- Apple Developer Account (for Apple Sign-In)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Apple Client ID to `.env.local`

5. Start development server:
   ```bash
   npm run dev
   ```
   > Runs on http://localhost:8000 with Turbopack

### Production Build
```bash
npm run build && npm start
```

## User Flows

### For Customers
1. Sign in with Apple
2. Browse available trailers
3. Select dates and locations
4. Submit booking request
5. Wait for owner approval
6. Complete cash payment upon pickup

### For Trailer Owners
1. Sign in with Apple
2. List trailers for rent
3. Review incoming booking requests
4. Approve or deny requests
5. Manage active rentals
6. Process returns and deposits

## API Endpoints

- `POST /api/trailer-request` - Create new booking request
- `PUT /api/trailer-request/[id]` - Update booking status
- `GET /api/trailer-request` - Fetch booking requests

## Core Dependencies

### UI + Styling
- @radix-ui/** - Accessible component primitives
- tailwindcss - Utility-first CSS framework
- class-variance-authority, clsx, tailwind-merge - Styling utilities

### Authentication & Forms
- react-hook-form, @hookform/resolvers - Form management
- Apple Sign-In SDK (client-side)

### Specialized Components
- recharts - Data visualization
- react-day-picker - Date selection
- sonner - Toast notifications
- cmdk - Command palette

### Development
- eslint, postcss, typescript
- Turbopack for fast development builds

## Path Aliases

Defined in `tsconfig.json` and `components.json`:
- `@/components` → `src/components`
- `@/ui` → `src/components/ui`
- `@/hooks` → `src/hooks`
- `@/lib` → `src/lib`
- `@/context` → `src/context`

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Implement responsive designs
4. Test authentication flows
5. Ensure accessibility compliance

## License

This project is licensed under the MIT License.
