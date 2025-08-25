# Water Management System - Development Documentation

## Project Overview
A comprehensive water management system built with Next.js, React, and TypeScript for managing customers, staff, payments, and water infrastructure.

## Technology Stack
- **Frontend Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Maps**: Leaflet with React-Leaflet
- **Date Handling**: date-fns
- **State Management**: React Hooks (useState, useEffect, useMemo)

## Project Structure

```
water/
├── src/
│   ├── components/
│   │   ├── layout/          # Core layout components
│   │   │   ├── Header.tsx   # Main header with navigation
│   │   │   ├── Menu.tsx     # Sidebar menu navigation
│   │   │   └── Footer.tsx   # Footer component
│   │   ├── pages/          # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CustomersPage.tsx
│   │   │   ├── StaffPage.tsx
│   │   │   ├── PaymentsListPage.tsx
│   │   │   ├── BankDepositsListPage.tsx
│   │   │   ├── VisitsListPage.tsx
│   │   │   ├── BillGenerationPage.tsx
│   │   │   └── [other pages...]
│   │   └── ui/             # Reusable UI components
│   │       ├── ModernSelect.tsx
│   │       ├── MonthYearPicker.tsx
│   │       ├── MonthYearPickerPortal.tsx
│   │       ├── ConfirmationModal.tsx
│   │       ├── DeactivationModal.tsx
│   │       ├── ReactivationModal.tsx
│   │       ├── StaffDeactivationModal.tsx
│   │       ├── StaffReactivationModal.tsx
│   │       ├── StaffDeactivatedModal.tsx
│   │       ├── VoidPaymentModal.tsx
│   │       ├── ReceiptModal.tsx
│   │       ├── ChequeModal.tsx
│   │       └── [other UI components...]
│   ├── lib/
│   │   └── data.ts         # Mock data and data structures
│   ├── styles/
│   │   └── globals.css     # Global styles and Tailwind imports
│   └── pages/
│       └── index.tsx       # Main application entry point
├── public/
│   └── images/            # Static images
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Key Features

### 1. Customer Management
- **Customer List**: Paginated table with search, sort, and filter capabilities
- **Customer Details**: Comprehensive customer information display
- **Add/Edit Customer**: Forms with validation for customer data entry
- **Customer Deactivation/Reactivation**: Modal-based workflow for managing customer status
- **Customer Location**: Map-based location tracking and visualization

### 2. Staff Management
- **Staff List**: Table view with role-based information display
- **Staff Details**: Complete staff profile with employment information
- **Add/Edit Staff**: Forms for staff data management
- **Staff Deactivation/Reactivation**: 
  - Active staff can be deactivated with reason tracking
  - Inactive staff show deactivation info with reactivation option
  - Confirmation workflows prevent accidental changes
- **Password/PIN Management**: Send credentials to staff members

### 3. Payment Processing
- **Payment List**: Transaction history with filtering options
- **Payment Recording**: Multiple payment methods (Cash, Cheque, Mobile Money)
- **Void Payments**: Secure void workflow with transaction confirmation
- **Receipt Generation**: Digital receipt creation and printing
- **Bank Deposits**: Track and manage bank deposit records

### 4. Infrastructure Management
- **Storage Tanks**: Monitor and manage water storage facilities
- **Pump Stations**: Track pump station operations and maintenance
- **Location Mapping**: Visual representation of infrastructure on maps

### 5. Reporting
- **Bill Generation**: Generate and export customer bills
- **Report Parameters**: Flexible filtering for report generation
- **Export Options**: PDF, Excel, and CSV export capabilities
- **Dashboard Analytics**: Real-time metrics and charts

## Component Architecture

### Layout Components
- **Header**: Displays current page title, user info, and top navigation
- **Menu**: Collapsible sidebar with hierarchical navigation
- **Footer**: Copyright and version information

### Modal System
All modals follow a consistent pattern:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Additional props specific to modal type
}
```

### Data Tables
Tables implement:
- Sorting (click column headers)
- Pagination (entries per page selection)
- Search/Filter functionality
- Export capabilities (Copy, Print, CSV, Excel)
- Responsive design with mobile card view

### Form Validation
Forms include:
- Real-time validation feedback
- Error message display
- Required field indicators
- Confirmation dialogs for destructive actions

## State Management Patterns

### Local State
Most components use React hooks for local state:
```typescript
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
```

### Data Flow
- Mock data stored in `/src/lib/data.ts`
- Parent components pass data via props
- Callbacks handle user interactions
- No global state management (keeping it simple)

## Styling Conventions

### Color Scheme
- **Primary**: Blue (`blue-600`, `blue-700`)
- **Success**: Green (`green-600`, `green-700`)
- **Danger**: Red (`red-600`, `red-700`)
- **Warning**: Amber (`amber-600`, `amber-700`)
- **Info**: Cyan (`cyan-600`, `cyan-700`)

### Component Styling
- Tailwind CSS utility classes
- Consistent spacing (p-4, p-6 for containers)
- Rounded corners (`rounded-lg`)
- Shadow effects (`shadow-sm`, `shadow-lg`)
- Hover states for interactive elements

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Card view on mobile, table view on desktop

## Modal Workflows

### Deactivation Flow
1. User clicks "Active" status badge
2. Deactivation modal opens requiring confirmation
3. User enters ID and phone number for verification
4. User selects reason for deactivation
5. Confirmation dialog shows summary
6. On confirm, status changes to Inactive

### Reactivation Flow
1. User clicks "Inactive" status badge
2. Deactivated info modal shows current status
3. User clicks "Reactivate" button
4. Reactivation modal opens requiring confirmation
5. User enters ID and phone for verification
6. User selects reason for reactivation
7. On confirm, status changes to Active

### Void Payment Flow
1. User clicks "Void" button on payment
2. Void modal opens with transaction details
3. User enters Transaction ID and Customer # for confirmation
4. User selects void reason
5. Confirmation dialog shows warning
6. On confirm, payment is marked as voided

## Recent Updates

### Version 3.2 Features
- Bill Generation report page with two-column layout
- MonthYearPickerPortal component to prevent dropdown overflow
- Staff deactivation/reactivation modal system
- Enhanced void payment confirmation with ID verification
- Fixed truncation issues in staff list table
- Improved responsive design for smaller screens

### Bug Fixes
- Fixed month picker overflow causing scrollbars
- Resolved dropdown cutoff in deactivation modals
- Corrected parsing errors in BillGenerationPage
- Fixed staff ID validation to accept leading zeros
- Removed data truncation in Role column

## Development Guidelines

### Code Style
- Use TypeScript interfaces for type safety
- Implement proper error handling
- Add comments for complex logic
- Follow React best practices (hooks rules)
- Keep components focused and reusable

### Testing Considerations
- Validate forms before submission
- Handle edge cases (empty data, long text)
- Test responsive layouts on various devices
- Ensure modal z-index layering is correct
- Verify data persistence across navigation

### Performance Optimization
- Use `useMemo` for expensive computations
- Implement pagination for large datasets
- Lazy load images and heavy components
- Minimize re-renders with proper dependency arrays

## API Integration (Future)

Currently using mock data from `/src/lib/data.ts`. Future integration points:

### Endpoints Needed
- `/api/customers` - CRUD operations for customers
- `/api/staff` - Staff management
- `/api/payments` - Payment processing
- `/api/infrastructure` - Tanks and pump stations
- `/api/reports` - Report generation
- `/api/auth` - Authentication and authorization

### Data Models
Interfaces defined in components should match backend models:
```typescript
interface Customer {
  id: number;
  name: string;
  accountNumber: string;
  phone: string;
  email: string;
  location: string;
  status: 'Active' | 'Inactive';
  // ... other fields
}
```

## Deployment Considerations

### Environment Variables
Create `.env.local` for:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_MAP_API_KEY` - Map service API key
- `DATABASE_URL` - Database connection string

### Build Process
```bash
npm run build
npm run start
```

### Production Optimizations
- Enable image optimization
- Configure caching headers
- Implement error boundaries
- Add monitoring and logging
- Set up CI/CD pipeline

## Security Considerations

### Authentication
- Implement JWT or session-based auth
- Add role-based access control
- Secure API endpoints
- Validate all user inputs

### Data Protection
- Encrypt sensitive data
- Implement HTTPS only
- Add CSRF protection
- Sanitize user inputs
- Implement rate limiting

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Review and refactor code regularly
- Update documentation as needed

### Monitoring
- Track application errors
- Monitor performance metrics
- Log user activities
- Set up alerts for critical issues

## Support and Contact

For questions or issues related to development:
- Review this documentation
- Check the codebase for examples
- Follow established patterns
- Maintain consistency with existing code

---

Last Updated: August 2025
Version: 3.2