# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VGS Assembly Web Ticketing System - A Next.js web dashboard for managing municipal assembly ticketing, revenue operations, customer management, and staff tracking. This is a client-side web application that connects to a Clojure backend API running on port 3000.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server on http://localhost:3001
npm run build        # Build production bundle
npm start            # Run production build
npm run lint         # Run ESLint
```

The development server runs on port 3001 to avoid conflicts with the backend API on port 3000.

### Backend Dependency
The application requires the Clojure backend API to be running on http://localhost:3000. The API base URL is configured in `.env.local` via `NEXT_PUBLIC_API_URL`.

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Maps**: Leaflet with React-Leaflet
- **Date Handling**: date-fns

### Application Structure

This is a **single-page application with client-side routing** managed through a centralized Dashboard component. The architecture differs from typical Next.js apps:

#### Routing Pattern
- **Central Router**: `src/components/Dashboard.tsx` manages all page navigation via React state (`currentPage`)
- **Page Components**: All pages are React components in `src/components/pages/`, NOT Next.js route files
- **App Router Usage**: Only used for authentication pages (`/login`) and the main dashboard mount point (`/dashboard`)
- Navigation is handled by the Sidebar component updating `currentPage` state, not Next.js routing

#### Core Components
```
src/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Landing page (redirects based on auth)
│   ├── login/page.tsx          # Login page (only real Next.js route)
│   └── dashboard/page.tsx      # Mounts <Dashboard /> component
├── components/
│   ├── Dashboard.tsx           # CENTRAL ROUTER - manages all page state
│   ├── layout/
│   │   ├── Header.tsx          # Top navigation bar
│   │   ├── Sidebar.tsx         # Menu navigation (updates currentPage)
│   │   ├── Footer.tsx          # Footer component
│   │   ├── DateRangePicker.tsx # Date range selection
│   │   └── MonthYearPicker.tsx # Month/year selection
│   ├── pages/                  # Page components (NOT routes)
│   │   ├── PerformancePage.tsx
│   │   ├── DebtPage.tsx
│   │   ├── TicketPaymentsPage.tsx
│   │   ├── StaffPage.tsx
│   │   └── [50+ other pages]
│   ├── charts/                 # Chart components
│   └── ui/                     # Reusable UI components (modals, cards, etc.)
├── contexts/
│   └── AuthContext.tsx         # Authentication state (localStorage-based)
├── lib/
│   ├── api.ts                  # API client for backend communication
│   ├── data.ts                 # Menu items and static data
│   └── utils.ts                # Utility functions
└── types/
    └── dashboard.ts            # TypeScript type definitions
```

### State Management Pattern

The Dashboard component maintains extensive state for:
- Current page display (`currentPage: PageType`)
- Date ranges for different pages (Performance, Debt, Visits, Payments)
- Selected entities (staff, customers) for detail views
- Sidebar and menu expansion states
- Modal/picker visibility states

When adding new pages:
1. Create component in `src/components/pages/`
2. Add page type to `PageType` union in `src/types/dashboard.ts`
3. Add menu item to `menuItems` in `src/lib/data.ts`
4. Import and render in Dashboard.tsx's page switch statement
5. Pass necessary state/setters as props

### API Integration

**Central API Client**: `src/lib/api.ts`
- Generic `fetchAPI<T>()` wrapper with error handling
- Automatic auth token injection from localStorage
- 401 auto-redirect to login
- All endpoints return typed responses
- Key endpoints: assemblies, transactions, locations, ticket-types, customer-types, authenticate, revenue reports

**Backend URL**: Configured via `NEXT_PUBLIC_API_URL` (defaults to http://localhost:3000)

### Authentication System

**Flow**:
1. Login via `/login` page (email/password → JWT token)
2. Token + user stored in localStorage (`auth_token`, `auth_user`)
3. AuthContext provides global auth state and methods
4. API client auto-includes token in headers
5. 401 responses auto-clear auth and redirect to login

**Protection**: The root `page.tsx` checks auth state and redirects unauthenticated users to `/login`

### TypeScript Path Aliases

The project uses `@/*` alias for imports:
```typescript
import { api } from '@/lib/api';
import { PageType } from '@/types/dashboard';
```

Configured in `tsconfig.json` with `baseUrl: "."` and `paths: { "@/*": ["./src/*"] }`

## Key Development Patterns

### Adding a New Page

1. **Create Page Component**:
   ```typescript
   // src/components/pages/NewFeaturePage.tsx
   export const NewFeaturePage = () => {
     // Your page implementation
   };
   ```

2. **Add Type Definition**:
   ```typescript
   // src/types/dashboard.ts
   export type PageType = 'performance' | 'debt' | ... | 'new-feature';
   ```

3. **Add Menu Item**:
   ```typescript
   // src/lib/data.ts
   { label: 'New Feature', page: 'new-feature' }
   ```

4. **Register in Dashboard**:
   ```typescript
   // src/components/Dashboard.tsx
   import { NewFeaturePage } from './pages/NewFeaturePage';

   // In renderPage():
   if (currentPage === 'new-feature') return <NewFeaturePage />;
   ```

### API Integration Pattern

```typescript
// Use the centralized API client
import { api } from '@/lib/api';

// In component:
const [data, setData] = useState([]);
useEffect(() => {
  api.getTransactions({ assembly_id: assemblyId })
    .then(setData)
    .catch(console.error);
}, [assemblyId]);
```

### Modal Patterns

Most pages use modals for detailed views. Common pattern:
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

// In JSX:
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  {/* Modal content */}
</Modal>
```

### Date Range Selection

Pages with date filtering follow this pattern:
```typescript
const [dateRange, setDateRange] = useState<DateRange>({
  start: '2025-08-01',
  end: '2025-08-31'
});

// Pass to DateRangePicker component
<DateRangePicker
  selectedRange={dateRange}
  onRangeChange={setDateRange}
/>
```

## Important Notes

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API base URL (defaults to http://localhost:3000)
- Must be prefixed with `NEXT_PUBLIC_` to be accessible in browser

### Client-Side Only Components
Most components use `'use client'` directive because:
- Heavy use of React hooks (useState, useEffect)
- Browser APIs (localStorage, fetch)
- Interactive charts and maps

### Data Fetching
- No server-side data fetching (no Server Components for data)
- All API calls happen client-side in useEffect hooks
- Consider loading states and error handling for all API calls

### Map Components
Leaflet integration requires special handling:
- Import map components dynamically with `{ ssr: false }`
- Maps won't render in SSR context
- See `CustomerLocationsPage.tsx` for examples

### TypeScript Strictness
- Strict mode enabled in tsconfig.json
- Always type API responses
- Use interfaces from `src/types/dashboard.ts`

### Performance Considerations
- Mobile-first design optimized for slow connections
- Bundle size target: ~107KB total first load
- Use code splitting for heavy components (maps, charts)
- Parallel API requests with Promise.all() where possible

## Common Tasks

### Testing Authentication
Test credentials in demo mode:
- Email: any email
- Password: `1234`
- Assembly ID: `11111111-1111-1111-1111-111111111111`

### Debugging API Issues
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify backend is running on port 3000
4. Check `localStorage` for `auth_token` and `auth_user`
5. API errors include status codes and messages via `APIError` class

### Working with Charts
- Use Recharts components from `src/components/charts/`
- Follow existing patterns in PerformancePage.tsx and DebtPage.tsx
- Charts support responsive sizing and tooltips

### GPS/Map Features
- Customer locations: `CustomerLocationsPage.tsx`
- Transaction tracking: `CollectorLocationsPage.tsx`
- Path visualization: `CollectorPathsPage.tsx`
- All use Leaflet with React-Leaflet

## Migration Notes

This project evolved from a water management system to a municipal ticketing system. Some legacy references may still exist:
- "customers" = ticket customers
- "storage-tanks" menu item = communities
- Some file names reference water-related concepts

When working with existing code, understand the business context has shifted to ticketing/revenue collection.

## Task Management with bd

This project uses **bd** (beads) for dependency-aware issue tracking. Issues are stored in `.beads/` directory.

### Common Commands

```bash
# View all tasks
bd list

# View ready tasks (no blocking dependencies)
bd ready

# Create a new task
bd create "Task description" -p 1 -t feature

# Show task details
bd show vgs-web-123

# Update task status
bd update vgs-web-123 --status in_progress

# Close a task
bd close vgs-web-123

# Add dependency (task2 blocks task1)
bd dep add vgs-web-1 vgs-web-2

# View dependency tree
bd dep tree vgs-web-1
```

### Task Workflow

1. **View ready work**: `bd ready` shows tasks ready to work on (no blockers)
2. **Claim a task**: `bd update vgs-web-123 --status in_progress`
3. **Complete the task**: `bd close vgs-web-123`
4. **Discover new work**: `bd create "New task" -p 1`

### Current Project Tasks

The following pages need to be updated with:
- Real API data integration (no mock data)
- Dark gradient headers (`bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800`)
- Proper export formatting with page-specific headers
- Loading and error states
- Field mapping (API kebab-case → display format)

**Priority 1 (List Pages):**
- LocationPage, TicketTypePage, CustomerTypePage, ZonesPage
- TicketPaymentsPage, TicketCustomersPage, BankDepositsListPage
- PerformancePage, DebtPage, RevenueOfficerPerformancePage
- CollectorLocationsPage, CollectorPathsPage, CustomerLocationsPage

**Priority 2 (Edit Pages):**
- EditStaffPage, EditCustomerPage, EditLocationPage
- EditTicketTypePage, EditCustomerTypePage, EditZonePage

Use `bd list` to see all tasks and their status.

### Integration Pattern

When updating a page, follow the StaffPage pattern:
1. Import API functions from `@/lib/api`
2. Add loading/error states
3. Fetch data in useEffect
4. Transform API data (kebab-case → camelCase)
5. Create page-specific export headers
6. Update export functions to use transformed data directly
7. Apply dark header styling
8. Close the bd task when complete
