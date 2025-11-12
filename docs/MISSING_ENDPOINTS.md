# Missing Backend Endpoints - Specification

This document lists endpoints needed by the web app that are **NOT yet available** in the backend API.

## 🔴 Critical Missing Endpoints

### 1. **Zones Management**

```
GET /api/zones
Query Params:
  - assembly-id: string (UUID, required)
  - active-only: boolean (optional)
Response: Array of Zone objects
[
  {
    "id": "uuid",
    "assembly-id": "uuid",
    "name": "string",
    "description": "string (nullable)",
    "created-at": "datetime",
    "updated-at": "datetime",
    "is-active": boolean
  }
]
```

```
POST /api/zones
Body:
{
  "assembly-id": "uuid",
  "name": "string (1-200 chars)",
  "description": "string (max 500 chars, optional)"
}
Response: Zone object (same schema as GET)
```

```
GET /api/zones/{id}
Path Params:
  - id: string (UUID)
Response: Single Zone object
```

```
PUT /api/zones/{id}
Path Params:
  - id: string (UUID)
Body:
{
  "name": "string (1-200 chars, optional)",
  "description": "string (max 500 chars, optional)"
}
Response: Updated Zone object
```

```
POST /api/zones/{id}/deactivate
Path Params:
  - id: string (UUID)
Response: { "message": "Zone deactivated successfully" }
```

---

### 2. **Update User (Edit Staff)**

```
PUT /api/users/{id}
Path Params:
  - id: string (UUID)
Body:
{
  "first-name": "string (1-100 chars, optional)",
  "last-name": "string (1-100 chars, optional)",
  "phone": "string (10-15 chars, optional)",
  "email": "string (optional)",
  "role": "officer | supervisor | admin (optional)",
  "zone-id": "uuid (optional, nullable)",
  "pin": "string (4-6 digits, optional)",
  "password": "string (optional)"
}
Response: Updated User object
{
  "id": "uuid",
  "assembly-id": "uuid",
  "first-name": "string",
  "last-name": "string",
  "name": "string",  // computed: first-name + last-name
  "phone": "string",
  "email": "string (nullable)",
  "role": "string",
  "zone-id": "uuid (nullable)",
  "is-active": boolean,
  "created-at": "datetime",
  "updated-at": "datetime"
}
```

---

### 3. **Update Customer**

```
PUT /api/customers/{id}
Path Params:
  - id: string (UUID)
Body:
{
  "location-id": "uuid (optional)",
  "customer-type-id": "uuid (optional)",
  "phone": "string (10-15 chars, optional)",
  "alt-phone": "string (10-15 chars, optional, nullable)",
  "identifier": "string (max 100 chars, optional, nullable)",
  "gps-latitude": number (optional, nullable),
  "gps-longitude": number (optional, nullable)
}
Response: Updated Customer object
{
  "id": "uuid",
  "assembly-id": "uuid",
  "location-id": "uuid",
  "customer-type-id": "uuid",
  "phone": "string",
  "alt-phone": "string (nullable)",
  "identifier": "string (nullable)",
  "gps-latitude": number (nullable),
  "gps-longitude": number (nullable),
  "is-active": boolean,
  "created-at": "datetime",
  "updated-at": "datetime"
}
```

```
GET /api/customers/{id}
Path Params:
  - id: string (UUID)
Response: Single Customer object (same schema as PUT response)
```

```
POST /api/customers/{id}/deactivate
Path Params:
  - id: string (UUID)
Response: { "message": "Customer deactivated successfully" }
```

```
POST /api/customers/{id}/reactivate
Path Params:
  - id: string (UUID)
Response: { "message": "Customer reactivated successfully" }
```

---

### 4. **Update Location**

```
PUT /api/locations/{id}
Path Params:
  - id: string (UUID)
Body:
{
  "name": "string (1-200 chars, optional)",
  "location-type": "string (optional)",
  "zone-id": "uuid (optional, nullable)",
  "gps-latitude": number (optional, nullable),
  "gps-longitude": number (optional, nullable)
}
Response: Updated Location object
{
  "id": "uuid",
  "assembly-id": "uuid",
  "name": "string",
  "location-type": "string",
  "zone-id": "uuid (nullable)",
  "gps-latitude": number (nullable),
  "gps-longitude": number (nullable),
  "is-active": boolean,
  "created-at": "datetime",
  "updated-at": "datetime"
}
```

```
GET /api/locations/{id}
Path Params:
  - id: string (UUID)
Response: Single Location object
```

```
POST /api/locations/{id}/deactivate
Path Params:
  - id: string (UUID)
Response: { "message": "Location deactivated successfully" }
```

---

### 5. **Update Ticket Type**

```
PUT /api/ticket-types/{id}
Path Params:
  - id: string (UUID)
Body:
{
  "name": "string (1-200 chars, optional)",
  "description": "string (max 500 chars, optional, nullable)"
}
Response: Updated Ticket Type object
{
  "id": "uuid",
  "assembly-id": "uuid",
  "name": "string",
  "description": "string (nullable)",
  "is-active": boolean,
  "created-at": "datetime",
  "updated-at": "datetime"
}
```

```
GET /api/ticket-types/{id}
Path Params:
  - id: string (UUID)
Response: Single Ticket Type object
```

```
POST /api/ticket-types/{id}/deactivate
Path Params:
  - id: string (UUID)
Response: { "message": "Ticket type deactivated successfully" }
```

---

### 6. **Update Customer Type**

```
PUT /api/customer-types/{id}
Path Params:
  - id: string (UUID)
Body:
{
  "name": "string (1-200 chars, optional)",
  "description": "string (max 500 chars, optional, nullable)"
}
Response: Updated Customer Type object
{
  "id": "uuid",
  "assembly-id": "uuid",
  "name": "string",
  "description": "string (nullable)",
  "is-active": boolean,
  "created-at": "datetime",
  "updated-at": "datetime"
}
```

```
GET /api/customer-types/{id}
Path Params:
  - id: string (UUID)
Response: Single Customer Type object
```

```
POST /api/customer-types/{id}/deactivate
Path Params:
  - id: string (UUID)
Response: { "message": "Customer type deactivated successfully" }
```

---

### 7. **Ticket Rates CRUD**

```
GET /api/ticket-rates
Query Params:
  - assembly-id: string (UUID, required)
  - ticket-type-id: string (UUID, optional)
  - customer-type-id: string (UUID, optional)
  - active-only: boolean (optional)
Response: Array of Ticket Rate objects
[
  {
    "id": "uuid",
    "assembly-id": "uuid",
    "ticket-type-id": "uuid",
    "customer-type-id": "uuid",
    "amount": number (decimal),
    "effective-date": "date",
    "end-date": "date (nullable)",
    "is-active": boolean,
    "created-at": "datetime"
  }
]
```

```
PUT /api/ticket-rates/{id}
Path Params:
  - id: string (UUID)
Body:
{
  "amount": number (decimal, optional),
  "effective-date": "date (optional)",
  "end-date": "date (optional, nullable)"
}
Response: Updated Ticket Rate object
```

```
POST /api/ticket-rates/{id}/deactivate
Path Params:
  - id: string (UUID)
Response: { "message": "Ticket rate deactivated successfully" }
```

---

## 🟡 Important Missing Endpoints

### 8. **Dashboard Statistics**

```
GET /api/reports/dashboard-stats
Query Params:
  - assembly-id: string (UUID, required)
  - start-date: date (optional, defaults to current month start)
  - end-date: date (optional, defaults to today)
Response:
{
  "total-revenue": number,
  "total-transactions": number,
  "total-customers": number,
  "active-revenue-officers": number,
  "revenue-by-ticket-type": [
    {
      "ticket-type-id": "uuid",
      "ticket-type-name": "string",
      "revenue": number,
      "transaction-count": number
    }
  ],
  "revenue-by-location": [
    {
      "location-id": "uuid",
      "location-name": "string",
      "revenue": number,
      "transaction-count": number
    }
  ],
  "monthly-revenue": [
    {
      "month": "YYYY-MM",
      "revenue": number,
      "transaction-count": number
    }
  ],
  "payment-method-breakdown": {
    "cash": number,
    "mobile-money": number,
    "cheque": number
  }
}
```

---

### 9. **Revenue Officer Performance Report**

```
GET /api/reports/officer-performance
Query Params:
  - assembly-id: string (UUID, required)
  - start-date: date (required)
  - end-date: date (required)
  - user-id: string (UUID, optional - for specific officer)
Response: Array
[
  {
    "user-id": "uuid",
    "user-name": "string",
    "total-revenue": number,
    "total-transactions": number,
    "cash-collected": number,
    "mobile-money-collected": number,
    "cheque-collected": number,
    "days-worked": number,
    "average-daily-revenue": number,
    "deposited-amount": number,
    "outstanding-balance": number
  }
]
```

---

### 10. **Customer Payment Status Report**

```
GET /api/reports/customer-payment-status
Query Params:
  - assembly-id: string (UUID, required)
  - start-date: date (optional)
  - end-date: date (optional)
  - location-id: string (UUID, optional)
Response:
{
  "total-customers": number,
  "paid-customers": number,
  "unpaid-customers": number,
  "partial-payment-customers": number,
  "customers-by-status": [
    {
      "status": "paid | unpaid | partial",
      "count": number,
      "percentage": number
    }
  ]
}
```

---

### 11. **GPS/Location Tracking Data**

```
GET /api/transactions/with-gps
Query Params:
  - assembly-id: string (UUID, required)
  - user-id: string (UUID, optional)
  - start-date: date (optional)
  - end-date: date (optional)
Response: Array of transactions with GPS data
[
  {
    "id": "uuid",
    "user-id": "uuid",
    "user-name": "string",
    "customer-id": "uuid",
    "customer-phone": "string",
    "location-name": "string",
    "amount": number,
    "transaction-date": "datetime",
    "gps-latitude": number,
    "gps-longitude": number
  }
]
```

---

### 12. **Revenue Officer Field Paths**

```
GET /api/reports/officer-paths
Query Params:
  - assembly-id: string (UUID, required)
  - user-id: string (UUID, required)
  - date: date (required - single day)
Response: Array of GPS points ordered by time
[
  {
    "transaction-id": "uuid",
    "timestamp": "datetime",
    "gps-latitude": number,
    "gps-longitude": number,
    "location-name": "string",
    "customer-phone": "string",
    "amount": number
  }
]
```

---

## 🟢 Nice-to-Have Endpoints

### 13. **Bulk Operations**

```
POST /api/transactions/bulk-void
Body:
{
  "transaction-ids": ["uuid", "uuid", ...],
  "reason": "string"
}
Response: { "voided-count": number, "failed-ids": ["uuid", ...] }
```

---

### 14. **Data Export**

```
GET /api/reports/export
Query Params:
  - assembly-id: string (UUID, required)
  - report-type: "revenue | transactions | customers | deposits"
  - format: "csv | excel | pdf"
  - start-date: date (required)
  - end-date: date (required)
Response: File download (Content-Type varies by format)
```

---

## Summary

### Critical (Must Have):
- Zones CRUD (5 endpoints)
- Update endpoints for Users, Customers, Locations, Ticket Types, Customer Types (13 endpoints)
- Ticket Rates list/update (3 endpoints)

### Important (High Priority):
- Dashboard statistics (1 endpoint)
- Revenue officer performance report (1 endpoint)
- Customer payment status report (1 endpoint)
- GPS transaction data (2 endpoints)

### Nice-to-Have (Lower Priority):
- Bulk operations (1 endpoint)
- Data export (1 endpoint)

**Total Missing Endpoints: ~28**
