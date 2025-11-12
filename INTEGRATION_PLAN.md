# API Integration Summary

## ✅ COMPLETED

### Authentication System
- ✅ Updated `AuthContext.tsx` to use `loginWeb()` from API client
- ✅ Added support for refresh tokens
- ✅ Updated login page to require Assembly ID
- ✅ Configured subdomain auto-detection in API client

### API Client (`src/lib/api.ts`)
- ✅ Added subdomain auto-detection (`getAPIBaseURL()`)
- ✅ Added 40+ endpoint functions
- ✅ Uses kebab-case field names matching backend
- ✅ Organized by category with JSDoc comments

## 🔄 IN PROGRESS

### Pages Requiring Updates

Below is the systematic approach to replace mock data with real API calls:

---

## Critical Pages (Priority 1)

### 1. **StaffPage.tsx** (Staff List)
**Current**: Uses `staffData` from `@/lib/data`
**Replace with**: `getUsers({ 'assembly-id': user['assembly-id'] })`
**Changes needed**:
```typescript
// Add at top
import { getUsers } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// In component
const { user } = useAuth();
const [staff, setStaff] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (user) {
    getUsers({ 'assembly-id': user['assembly-id'] })
      .then(setStaff)
      .catch(console.error)
      .finally(() => setLoading(false));
  }
}, [user]);
```

**Backend fields** (map to frontend):
- `id` → `id`
- `first-name` + `last-name` → `name`
- `phone` → `phone`
- `email` → `email` (nullable)
- `role` → `role`
- `zone-id` → Need zone name lookup
- `is-active` → `status` (Active/Inactive)
- `created-at` → `created`

---

### 2. **TicketPaymentsPage.tsx** (Transaction List)
**Current**: Uses hardcoded `ticketPaymentsData` array
**Replace with**: `getTransactions({ 'assembly-id': user['assembly-id'], 'start-date': ..., 'end-date': ... })`
**Changes needed**:
```typescript
import { getTransactions } from '@/lib/api';

useEffect(() => {
  if (user && dateRange) {
    getTransactions({
      'assembly-id': user['assembly-id'],
      'start-date': dateRange.start,
      'end-date': dateRange.end
    })
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }
}, [user, dateRange]);
```

**Backend Response Fields**:
- `id`, `user-id`, `customer-id`, `ticket-type-id`
- `amount`, `payment-type`, `transaction-date`
- `gps-latitude`, `gps-longitude`
- `cheque-number`, `receipt-photo-url`
- `is-voided`, `void-reason`

**NOTE**: You'll need JOIN data for display (customer phone, location name, etc.)
**MISSING ENDPOINT**: `GET /api/transactions` currently doesn't return joined data

---

### 3. **TicketCustomersPage.tsx** (Customer List)
**Current**: Uses mock customer data
**Replace with**: `getCustomers({ 'assembly-id': user['assembly-id'] })`
**Changes needed**:
```typescript
import { getCustomers } from '@/lib/api';

useEffect(() => {
  if (user) {
    getCustomers({
      'assembly-id': user['assembly-id'],
      limit: parseInt(entriesPerPage),
      offset: (currentPage - 1) * parseInt(entriesPerPage)
    })
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }
}, [user, currentPage, entriesPerPage]);
```

**Backend fields**:
- `id`, `phone`, `alt-phone`, `identifier`
- `location-id`, `customer-type-id`
- `gps-latitude`, `gps-longitude`
- `is-active`

**NOTE**: Need location name and customer type name (requires JOINs)

---

### 4. **PerformancePage.tsx** (Dashboard)
**Current**: Uses `chartData`, `customerPaymentStatusData`, etc.
**Replace with**: Dashboard stats endpoint
**MISSING ENDPOINT**: `GET /api/reports/dashboard-stats` (see MISSING_ENDPOINTS.md #8)

---

### 5. **DebtPage.tsx** (Debt Overview)
**Current**: Uses `paidCustomersData`, `totalDebtData`, `debtByMonthsData`
**Replace with**: Customer payment status report
**MISSING ENDPOINT**: `GET /api/reports/customer-payment-status` (see MISSING_ENDPOINTS.md #10)

---

## Configuration Pages (Priority 2)

### 6. **LocationPage.tsx**
**Current**: Uses `locationsData`
**Replace with**: `getLocations(user['assembly-id'])`
**Status**: ✅ Endpoint exists

### 7. **TicketTypePage.tsx**
**Current**: Uses `ticketTypesData`
**Replace with**: `getTicketTypes(user['assembly-id'])`
**Status**: ✅ Endpoint exists

### 8. **CustomerTypePage.tsx**
**Current**: Uses `customerTypesData`
**Replace with**: `getCustomerTypes(user['assembly-id'])`
**Status**: ✅ Endpoint exists

### 9. **ZonesPage.tsx**
**Current**: Uses `zonesData`
**Replace with**: Zones endpoint
**Status**: 🔴 **MISSING** - Need `GET /api/zones` (see MISSING_ENDPOINTS.md #1)

### 10. **CommunityPage.tsx**
**Current**: Uses `communitiesData`
**Replace with**: Communities/areas endpoint
**Status**: 🔴 **MISSING** - No backend concept of "communities" yet

### 11. **TicketRatesPage.tsx**
**Current**: Likely has mock rate data
**Replace with**: Ticket rates endpoint
**Status**: 🔴 **PARTIAL** - Can create rates, but need list endpoint (see MISSING_ENDPOINTS.md #7)

---

## Form Pages (Priority 3)

### Add/Edit Pages (Need UPDATE endpoints)
All these need backend PUT endpoints:

- `AddStaffPage.tsx` → Uses `createUser()` ✅
- `EditStaffPage.tsx` → **MISSING** `PUT /api/users/{id}`
- `AddCustomerPage.tsx` → Uses `createCustomer()` ✅
- `EditCustomerPage.tsx` → **MISSING** `PUT /api/customers/{id}`
- `AddLocationPage.tsx` → Uses `createLocation()` ✅
- `EditLocationPage.tsx` → **MISSING** `PUT /api/locations/{id}`
- `AddTicketTypePage.tsx` → Uses `createTicketType()` ✅
- `EditTicketTypePage.tsx` → **MISSING** `PUT /api/ticket-types/{id}`
- `AddCustomerTypePage.tsx` → Uses `createCustomerType()` ✅
- `EditCustomerTypePage.tsx` → **MISSING** `PUT /api/customer-types/{id}`
- `AddZonePage.tsx` → **MISSING** `POST /api/zones`
- `EditZonePage.tsx` → **MISSING** `PUT /api/zones/{id}`

---

## GPS/Tracking Pages (Priority 4)

### 12. **CollectorLocationsPage.tsx**
**Current**: Likely has mock GPS data
**Replace with**: GPS transactions endpoint
**Status**: 🔴 **MISSING** - `GET /api/transactions/with-gps` (see MISSING_ENDPOINTS.md #11)

### 13. **CollectorPathsPage.tsx**
**Current**: Mock officer path data
**Replace with**: Officer paths endpoint
**Status**: 🔴 **MISSING** - `GET /api/reports/officer-paths` (see MISSING_ENDPOINTS.md #12)

### 14. **CustomerLocationsPage.tsx**
**Current**: Mock customer GPS data
**Replace with**: Get customers with GPS data
**Status**: ⚠️ **PARTIAL** - `getCustomers()` returns GPS but needs filtering

---

## Reports Pages (Priority 4)

### 15. **BillGenerationPage.tsx** (Revenue Report)
**Current**: Mock revenue data
**Replace with**: `getRevenueReport({ 'assembly-id', 'start-date', 'end-date' })`
**Status**: ✅ Endpoint exists

### 16. **BankDepositsListPage.tsx**
**Current**: Mock deposits
**Replace with**: `getDeposits({ 'assembly-id': ..., ... })`
**Status**: ✅ Endpoint exists

### 17. **RevenueOfficerPerformancePage.tsx**
**Current**: Mock performance data
**Replace with**: Officer performance report
**Status**: 🔴 **MISSING** - `GET /api/reports/officer-performance` (see MISSING_ENDPOINTS.md #9)

---

## Data Model Mapping Issues

### Problem: Frontend expects denormalized/joined data

**Example**: `TicketPaymentsPage` displays:
- Customer phone
- Location name
- Zone name
- Revenue officer name
- Community name

**Backend returns**: Only IDs (`customer-id`, `location-id`, `user-id`)

**Solutions**:
1. **Backend**: Modify transaction endpoint to return joined data
2. **Frontend**: Make multiple API calls and join client-side (slower)
3. **Backend**: Create dedicated view/report endpoints with pre-joined data

**Recommendation**: Add query param like `?include=customer,location,user` to transaction endpoint

---

## Summary of Missing Endpoints

See `MISSING_ENDPOINTS.md` for detailed specs. Critical ones:

1. ✅ **Zones CRUD** (5 endpoints)
2. ✅ **UPDATE endpoints** for users, customers, locations, types (13 endpoints)
3. ✅ **Ticket rates list** (1 endpoint)
4. ⚠️ **Dashboard stats** (1 endpoint)
5. ⚠️ **Revenue officer performance** (1 endpoint)
6. ⚠️ **Customer payment status report** (1 endpoint)
7. ⚠️ **GPS/tracking data** (2 endpoints)

**Total missing**: ~28 endpoints

---

## Next Steps

1. **Add missing backend endpoints** (use MISSING_ENDPOINTS.md as spec)
2. **Update frontend pages systematically** (use priority order above)
3. **Handle data joins** (decide on backend vs frontend approach)
4. **Add error boundaries** (handle API failures gracefully)
5. **Add loading states** (show spinners during API calls)
6. **Remove mock data** (delete unused exports from `src/lib/data.ts`)

---

## Quick Start Commands

After backend endpoints are ready:

```bash
# Navigate to project
cd /Users/kay/Sources/VGS/Assembly/vgs-assembly-web-ticketing

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Access at your tenant subdomain
open http://demo.localhost:3001
```

**Test credentials** (adjust based on your backend):
- Assembly ID: `[your-assembly-uuid]`
- Email: `[admin-email]`
- Password: `[admin-password]`
