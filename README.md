# VGS Assembly Web Ticketing System

A Next.js web dashboard for managing municipal assembly ticketing, revenue operations, customer management, and staff tracking.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The development server runs on `http://localhost:3001` (configured to avoid conflicts with the backend API on port 3000).

## Backend Dependency

This application requires the Clojure backend API running on `http://localhost:3000`. Configure the API URL in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Maps:** Leaflet with React-Leaflet
- **Date Handling:** date-fns

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── pages/       # Page components (NOT Next.js routes)
│   ├── layout/      # Layout components (Header, Sidebar, Footer)
│   ├── ui/          # Reusable UI components
│   └── charts/      # Chart components
├── contexts/        # React contexts (Auth, etc.)
├── lib/             # Utilities and API client
└── types/           # TypeScript type definitions
```

## Documentation

All project documentation is located in the [`docs/`](./docs) directory:

### Getting Started
- [Quick Start Guide](./docs/QUICK_START.md) - Fast setup instructions
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflow
- [Development Documentation](./docs/DEVELOPMENT_DOCUMENTATION.md) - Comprehensive dev docs

### Testing & Deployment
- [Testing Guide](./docs/TESTING_GUIDE.md) - Testing strategies
- [Test Coverage Summary](./docs/TEST_COVERAGE_SUMMARY.md) - Test coverage report
- [Map Testing Guide](./docs/MAP_TESTING_GUIDE.md) - GPS/map feature testing
- [AWS Deployment Options](./docs/AWS_DEPLOYMENT_OPTIONS.md) - Cloud deployment guide
- [CI/CD Setup](./docs/CI_CD_SETUP.md) - Continuous integration setup

### Integration & Features
- [Integration Plan](./docs/INTEGRATION_PLAN.md) - System integration overview
- [Integration Complete](./docs/INTEGRATION_COMPLETE.md) - Integration status
- [WhatsApp Integration](./docs/WHATSAPP_INTEGRATION.md) - WhatsApp feature docs
- [Missing Endpoints](./docs/MISSING_ENDPOINTS.md) - API gaps

### Project History & Summaries
- [Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md) - Feature implementation log
- [Project Setup Complete](./docs/PROJECT_SETUP_COMPLETE.md) - Initial setup notes
- [Project Completion Summary](./docs/PROJECT_COMPLETION_SUMMARY.md) - Project milestones
- [Comprehensive Analysis](./docs/COMPREHENSIVE_ANALYSIS.md) - System analysis

### Bug Fixes & Updates
- [Backend Login Update Needed](./docs/BACKEND_LOGIN_UPDATE_NEEDED.md) - Auth updates
- [Login Fix Summary](./docs/LOGIN_FIX_SUMMARY.md) - Login bug fixes
- [Staff Page Fixes](./docs/STAFF_PAGE_FIXES.md) - Staff module fixes
- [Fixes Completed](./docs/FIXES_COMPLETED.md) - Bug fix log (Round 1)
- [Fixes Round 2](./docs/FIXES_ROUND_2.md) - Bug fix log (Round 2)
- [Edit Pages Update Summary](./docs/EDIT_PAGES_UPDATE_SUMMARY.md) - Edit form updates

### Architecture & Specifications
- [Web Dashboard README](./docs/WEB_DASHBOARD_README.md) - Dashboard architecture
- [Zone Permissions Spec](./docs/ZONE_PERMISSIONS_SPEC.md) - Hierarchical zone-based access control specification
- [Backend Request](./docs/BACKEND_REQUEST.md) - Backend API requirements
- [Summary](./docs/SUMMARY.md) - Project summary

## Architecture Highlights

### Routing Pattern
This is a **single-page application with client-side routing** managed through a centralized Dashboard component (`src/components/Dashboard.tsx`), not traditional Next.js file-based routing. Navigation is handled by updating React state, not URL changes.

### Authentication
- JWT-based authentication with localStorage persistence
- Auto-redirect to login on 401 responses
- Global auth state via React Context

### API Integration
- Centralized API client (`src/lib/api.ts`) with automatic token injection
- Multi-tenant backend with subdomain-based routing
- All endpoints return typed responses

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build production bundle
npm start            # Run production build
npm run lint         # Run ESLint
```

## Contributing

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and project-specific instructions for AI-assisted development.

## License

[License information to be added]

---

**Last Updated:** 2025-01-12
