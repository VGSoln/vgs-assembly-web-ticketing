# Zone-Based Permission System - Technical Specification

## Document Information
- **Version:** 1.0
- **Date:** 2025-01-12
- **Status:** Draft for Review
- **Author:** Technical Specification
- **Scope:** Hierarchical zone-based access control with automatic permission inheritance

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Requirements](#2-system-requirements)
3. [Data Model Changes](#3-data-model-changes)
4. [Permission Logic & Algorithms](#4-permission-logic--algorithms)
5. [API Changes](#5-api-changes)
6. [Frontend Changes](#6-frontend-changes)
7. [Edge Cases & Business Rules](#7-edge-cases--business-rules)
8. [Migration Strategy](#8-migration-strategy)
9. [Testing Requirements](#9-testing-requirements)
10. [Implementation Phases](#10-implementation-phases)

---

## 1. Executive Summary

### Business Requirement
Implement hierarchical zone-based permissions where staff users can be assigned:
- **Global Access:** All zones across the entire District Assembly
- **Community-Level Access:** All zones within specific communities (with automatic inheritance when new zones are added)
- **Zone-Level Access:** Specific individual zones only

### Key Behaviors
1. **Automatic Zone Addition:** If a user is assigned to "Community A" and a new zone is created in Community A, the user automatically gets access
2. **Zone Movement Persistence:** If a user is explicitly assigned to "Zone 5" and Zone 5 is moved from Community A to Community B, the user retains access to Zone 5
3. **Community-Level Inheritance:** If a user is only assigned to Community A (not Zone 5 explicitly) and Zone 5 is moved to Community B, the user loses access to Zone 5
4. **Data Filtering:** All dashboards, lists, reports, and aggregations show only data from zones the user can access
5. **Audit Trail:** Track when and how permissions were granted (explicit vs inherited)

### Current State
- **Backend:** Single `zone-id` field per user (supports only 1 zone assignment)
- **Frontend:** `HierarchicalAccess` UI component exists but doesn't persist to backend
- **Filtering:** No zone-based filtering implemented anywhere
- **Hierarchy:** Missing "Community" entity in backend (only exists as UI grouping)

### Target State
- **Backend:** Junction table tracking explicit assignments with inheritance resolution
- **Frontend:** All 40+ pages filter data based on user's accessible zones
- **API:** All endpoints accept optional `zone-ids[]` parameter for server-side filtering
- **Hierarchy:** `Assembly → Community → Zone → Location → Customer` fully modeled

---

## 2. System Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Users can be assigned global access OR custom access (mutually exclusive) | P0 - Critical |
| FR-2 | Users with custom access can be assigned multiple communities | P0 - Critical |
| FR-3 | Users with custom access can be assigned individual zones | P0 - Critical |
| FR-4 | Users can have mixed assignments (communities + specific zones) | P0 - Critical |
| FR-5 | When a new zone is added to a community, users assigned to that community automatically gain access | P0 - Critical |
| FR-6 | When a zone is moved between communities, explicitly-assigned users retain access | P0 - Critical |
| FR-7 | When a zone is moved between communities, community-assigned users lose access if not in new community | P0 - Critical |
| FR-8 | When a zone is deleted, permissions referencing it are automatically removed | P1 - High |
| FR-9 | When a community is deactivated, zone assignments remain intact (manual cleanup required) | P1 - High |
| FR-10 | All list pages filter data by accessible zones | P0 - Critical |
| FR-11 | All dashboard aggregations filter by accessible zones | P0 - Critical |
| FR-12 | All reports filter by accessible zones | P0 - Critical |
| FR-13 | Export functions respect zone filtering | P1 - High |
| FR-14 | Users cannot view/edit entities outside their accessible zones | P0 - Critical |
| FR-15 | Audit trail tracks permission grants, changes, and revocations | P1 - High |

### 2.2 Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | API response time for zone resolution | < 100ms |
| NFR-2 | Dashboard load time with zone filtering | < 2s |
| NFR-3 | Permission check overhead per request | < 50ms |
| NFR-4 | Support for users with 100+ zone assignments | Must handle |
| NFR-5 | Audit log retention period | 2 years minimum |

---

## 3. Data Model Changes

### 3.1 New Tables

#### 3.1.1 `communities` Table

**Purpose:** First-class entity for community grouping

```sql
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assembly_id UUID NOT NULL REFERENCES assemblies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  CONSTRAINT uk_communities_assembly_name UNIQUE (assembly_id, name)
);

CREATE INDEX idx_communities_assembly ON communities(assembly_id);
CREATE INDEX idx_communities_active ON communities(is_active) WHERE is_active = true;
```

#### 3.1.2 `user_zone_permissions` Junction Table

**Purpose:** Track explicit and inherited zone permissions with audit trail

```sql
CREATE TABLE user_zone_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- What they're assigned to
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('community', 'zone')),
  entity_id UUID NOT NULL,

  -- How they got it
  granted_explicitly BOOLEAN NOT NULL DEFAULT true,
  granted_via_community_id UUID REFERENCES communities(id) ON DELETE SET NULL,

  -- Audit fields
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by UUID REFERENCES users(id),
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES users(id),

  -- Metadata
  notes TEXT,

  CONSTRAINT uk_user_zone_permission UNIQUE (user_id, entity_type, entity_id, revoked_at)
);

CREATE INDEX idx_uzp_user ON user_zone_permissions(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_uzp_entity ON user_zone_permissions(entity_type, entity_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_uzp_active ON user_zone_permissions(user_id, revoked_at);
```

#### 3.1.3 `permission_audit_log` Table

**Purpose:** Complete audit trail of permission changes

```sql
CREATE TABLE permission_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(50) NOT NULL, -- 'grant', 'revoke', 'auto_grant_zone_added', 'auto_revoke_zone_moved', etc.
  entity_type VARCHAR(20) NOT NULL,
  entity_id UUID NOT NULL,
  entity_name VARCHAR(255),
  reason TEXT,
  metadata JSONB, -- Flexible field for additional context
  performed_by UUID REFERENCES users(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_pal_user ON permission_audit_log(user_id, performed_at DESC);
CREATE INDEX idx_pal_entity ON permission_audit_log(entity_type, entity_id);
CREATE INDEX idx_pal_action ON permission_audit_log(action, performed_at DESC);
```

### 3.2 Modified Tables

#### 3.2.1 `zones` Table - Add `community_id`

```sql
ALTER TABLE zones
  ADD COLUMN community_id UUID REFERENCES communities(id) ON DELETE SET NULL;

CREATE INDEX idx_zones_community ON zones(community_id);
```

**Note:** `community_id` is nullable to support zones not yet assigned to a community.

#### 3.2.2 `users` Table - Modify Permission Fields

```sql
-- Deprecate old single zone_id field (keep for migration, remove after)
ALTER TABLE users
  RENAME COLUMN zone_id TO legacy_zone_id;

-- Add new access type field
ALTER TABLE users
  ADD COLUMN access_type VARCHAR(20) NOT NULL DEFAULT 'global'
    CHECK (access_type IN ('global', 'custom'));

-- Add index for quick filtering
CREATE INDEX idx_users_access_type ON users(access_type);
```

### 3.3 Data Relationships Diagram

```
assemblies (1) ─────────> (N) communities
                               │
                               │ (1)
                               ↓
                          (N) zones
                               │
                               │ (1)
                               ↓
                          (N) locations
                               │
                               │ (1)
                               ↓
                          (N) customers
                               │
                               │ (1)
                               ↓
                          (N) transactions

users (1) ──────> (N) user_zone_permissions
                       │
                       ├─> entity_type = 'community' ──> communities
                       └─> entity_type = 'zone' ──> zones
```

---

## 4. Permission Logic & Algorithms

### 4.1 Permission Resolution Algorithm

**Function:** `resolveUserAccessibleZones(userId: UUID) → zoneIds[]`

```sql
-- PostgreSQL function to resolve user's accessible zones
CREATE OR REPLACE FUNCTION resolve_user_accessible_zones(p_user_id UUID)
RETURNS TABLE (zone_id UUID, zone_name VARCHAR, community_id UUID, community_name VARCHAR, access_source VARCHAR)
AS $$
BEGIN
  -- Check if user has global access
  IF EXISTS (SELECT 1 FROM users WHERE id = p_user_id AND access_type = 'global') THEN
    -- Return ALL zones in user's assembly
    RETURN QUERY
    SELECT
      z.id AS zone_id,
      z.name AS zone_name,
      z.community_id,
      c.name AS community_name,
      'global'::VARCHAR AS access_source
    FROM zones z
    LEFT JOIN communities c ON c.id = z.community_id
    WHERE z.assembly_id = (SELECT assembly_id FROM users WHERE id = p_user_id)
      AND z.is_active = true;
    RETURN;
  END IF;

  -- Custom access: resolve from permissions
  RETURN QUERY
  WITH active_permissions AS (
    SELECT entity_type, entity_id, granted_explicitly
    FROM user_zone_permissions
    WHERE user_id = p_user_id
      AND revoked_at IS NULL
  ),
  -- Zones from explicit zone assignments
  explicit_zones AS (
    SELECT
      z.id AS zone_id,
      z.name AS zone_name,
      z.community_id,
      c.name AS community_name,
      'explicit_zone'::VARCHAR AS access_source
    FROM active_permissions ap
    JOIN zones z ON z.id = ap.entity_id
    LEFT JOIN communities c ON c.id = z.community_id
    WHERE ap.entity_type = 'zone'
      AND z.is_active = true
  ),
  -- Zones from community assignments (inherited)
  community_zones AS (
    SELECT
      z.id AS zone_id,
      z.name AS zone_name,
      z.community_id,
      c.name AS community_name,
      ('community:' || c.name)::VARCHAR AS access_source
    FROM active_permissions ap
    JOIN communities c ON c.id = ap.entity_id
    JOIN zones z ON z.community_id = c.id
    WHERE ap.entity_type = 'community'
      AND c.is_active = true
      AND z.is_active = true
  )
  -- Union both sources, remove duplicates
  SELECT * FROM explicit_zones
  UNION
  SELECT * FROM community_zones;
END;
$$ LANGUAGE plpgsql STABLE;
```

### 4.2 Zone Movement Logic

**Trigger:** When `zones.community_id` is updated

```sql
CREATE OR REPLACE FUNCTION handle_zone_community_change()
RETURNS TRIGGER AS $$
DECLARE
  v_old_community_id UUID;
  v_new_community_id UUID;
  v_zone_name VARCHAR;
  v_affected_users RECORD;
BEGIN
  v_old_community_id := OLD.community_id;
  v_new_community_id := NEW.community_id;
  v_zone_name := NEW.name;

  -- Only proceed if community actually changed
  IF v_old_community_id IS DISTINCT FROM v_new_community_id THEN

    -- For each user with community-level access to the OLD community
    -- (not explicit zone access), revoke their inherited permission
    FOR v_affected_users IN
      SELECT DISTINCT uzp.user_id, u.email
      FROM user_zone_permissions uzp
      JOIN users u ON u.id = uzp.user_id
      WHERE uzp.entity_type = 'community'
        AND uzp.entity_id = v_old_community_id
        AND uzp.revoked_at IS NULL
        -- Exclude users who have explicit zone access
        AND NOT EXISTS (
          SELECT 1 FROM user_zone_permissions uzp2
          WHERE uzp2.user_id = uzp.user_id
            AND uzp2.entity_type = 'zone'
            AND uzp2.entity_id = NEW.id
            AND uzp2.revoked_at IS NULL
        )
    LOOP
      -- Log the automatic revocation
      INSERT INTO permission_audit_log (
        user_id, action, entity_type, entity_id, entity_name,
        reason, metadata, performed_at
      ) VALUES (
        v_affected_users.user_id,
        'auto_revoke_zone_moved',
        'zone',
        NEW.id,
        v_zone_name,
        format('Zone moved from community %s to %s', v_old_community_id, v_new_community_id),
        jsonb_build_object(
          'old_community_id', v_old_community_id,
          'new_community_id', v_new_community_id,
          'user_email', v_affected_users.email
        ),
        NOW()
      );
    END LOOP;

    -- For users with community-level access to the NEW community,
    -- automatically grant access to this zone
    FOR v_affected_users IN
      SELECT DISTINCT uzp.user_id, u.email
      FROM user_zone_permissions uzp
      JOIN users u ON u.id = uzp.user_id
      WHERE uzp.entity_type = 'community'
        AND uzp.entity_id = v_new_community_id
        AND uzp.revoked_at IS NULL
    LOOP
      -- Log the automatic grant
      INSERT INTO permission_audit_log (
        user_id, action, entity_type, entity_id, entity_name,
        reason, metadata, performed_at
      ) VALUES (
        v_affected_users.user_id,
        'auto_grant_zone_moved',
        'zone',
        NEW.id,
        v_zone_name,
        format('Zone moved to user''s assigned community %s', v_new_community_id),
        jsonb_build_object(
          'old_community_id', v_old_community_id,
          'new_community_id', v_new_community_id,
          'user_email', v_affected_users.email
        ),
        NOW()
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER zones_community_change_trigger
AFTER UPDATE OF community_id ON zones
FOR EACH ROW
EXECUTE FUNCTION handle_zone_community_change();
```

### 4.3 New Zone Creation Logic

**Trigger:** When a new zone is created with `community_id`

```sql
CREATE OR REPLACE FUNCTION handle_new_zone_creation()
RETURNS TRIGGER AS $$
DECLARE
  v_affected_users RECORD;
BEGIN
  -- If zone is created with a community assignment
  IF NEW.community_id IS NOT NULL THEN

    -- Grant access to all users assigned to this community
    FOR v_affected_users IN
      SELECT DISTINCT uzp.user_id, u.email
      FROM user_zone_permissions uzp
      JOIN users u ON u.id = uzp.user_id
      WHERE uzp.entity_type = 'community'
        AND uzp.entity_id = NEW.community_id
        AND uzp.revoked_at IS NULL
    LOOP
      -- Log the automatic grant
      INSERT INTO permission_audit_log (
        user_id, action, entity_type, entity_id, entity_name,
        reason, metadata, performed_at
      ) VALUES (
        v_affected_users.user_id,
        'auto_grant_zone_created',
        'zone',
        NEW.id,
        NEW.name,
        format('New zone created in user''s assigned community %s', NEW.community_id),
        jsonb_build_object(
          'community_id', NEW.community_id,
          'user_email', v_affected_users.email
        ),
        NOW()
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER zones_creation_trigger
AFTER INSERT ON zones
FOR EACH ROW
EXECUTE FUNCTION handle_new_zone_creation();
```

### 4.4 Zone Deletion Logic

**Trigger:** When a zone is soft-deleted (is_active = false) or hard-deleted

```sql
CREATE OR REPLACE FUNCTION handle_zone_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Revoke all explicit zone permissions for this zone
  UPDATE user_zone_permissions
  SET revoked_at = NOW(),
      revoked_by = NULLIF(current_setting('app.current_user_id', true), '')::UUID
  WHERE entity_type = 'zone'
    AND entity_id = OLD.id
    AND revoked_at IS NULL;

  -- Log the revocations
  INSERT INTO permission_audit_log (
    user_id, action, entity_type, entity_id, entity_name,
    reason, performed_at
  )
  SELECT
    uzp.user_id,
    'auto_revoke_zone_deleted',
    'zone',
    OLD.id,
    OLD.name,
    'Zone was deleted or deactivated',
    NOW()
  FROM user_zone_permissions uzp
  WHERE uzp.entity_type = 'zone'
    AND uzp.entity_id = OLD.id
    AND uzp.revoked_at = NOW(); -- Just revoked in the UPDATE above

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger on DELETE
CREATE TRIGGER zones_deletion_trigger
BEFORE DELETE ON zones
FOR EACH ROW
EXECUTE FUNCTION handle_zone_deletion();

-- Trigger on deactivation (soft delete)
CREATE TRIGGER zones_deactivation_trigger
AFTER UPDATE OF is_active ON zones
FOR EACH ROW
WHEN (NEW.is_active = false AND OLD.is_active = true)
EXECUTE FUNCTION handle_zone_deletion();
```

---

## 5. API Changes

### 5.1 New API Endpoints

#### 5.1.1 Communities Management

```http
GET    /api/communities?assembly-id={uuid}
POST   /api/communities
GET    /api/communities/{id}
PUT    /api/communities/{id}
DELETE /api/communities/{id}/deactivate
```

**GET /api/communities Response:**
```json
[
  {
    "id": "uuid",
    "assembly-id": "uuid",
    "name": "Adum Community",
    "description": "Central business district",
    "is-active": true,
    "zone-count": 6,
    "customer-count": 1234,
    "created-at": "2025-01-01T00:00:00Z"
  }
]
```

#### 5.1.2 User Permissions Management

```http
GET    /api/users/{user-id}/permissions
POST   /api/users/{user-id}/permissions/grant
POST   /api/users/{user-id}/permissions/revoke
GET    /api/users/{user-id}/accessible-zones
```

**POST /api/users/{user-id}/permissions/grant Request:**
```json
{
  "entity-type": "community",
  "entity-id": "uuid",
  "granted-by": "uuid",
  "notes": "Assigned to cover this area"
}
```

**GET /api/users/{user-id}/accessible-zones Response:**
```json
{
  "access-type": "custom",
  "zones": [
    {
      "zone-id": "uuid",
      "zone-name": "Zone 1",
      "community-id": "uuid",
      "community-name": "Adum Community",
      "access-source": "explicit_zone"
    },
    {
      "zone-id": "uuid",
      "zone-name": "Zone 2",
      "community-id": "uuid",
      "community-name": "Adum Community",
      "access-source": "community:Adum Community"
    }
  ]
}
```

#### 5.1.3 Permission Audit Log

```http
GET /api/users/{user-id}/permission-audit?start-date={date}&end-date={date}
GET /api/permission-audit?entity-type={type}&entity-id={uuid}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user-id": "uuid",
    "user-name": "John Doe",
    "action": "auto_grant_zone_created",
    "entity-type": "zone",
    "entity-id": "uuid",
    "entity-name": "Zone 7",
    "reason": "New zone created in user's assigned community abc-123",
    "performed-by": null,
    "performed-at": "2025-01-12T10:30:00Z"
  }
]
```

### 5.2 Modified Endpoints - Add Zone Filtering

**Pattern:** All list/query endpoints add optional `zone-ids` parameter

#### 5.2.1 Customers

```http
GET /api/customers?assembly-id={uuid}&zone-ids={uuid,uuid,uuid}
```

**Backend Implementation:**
```sql
-- Add to WHERE clause
WHERE customers.location_id IN (
  SELECT id FROM locations
  WHERE zone_id = ANY(ARRAY[zone_ids_param])
)
```

#### 5.2.2 Transactions

```http
GET /api/transactions?assembly-id={uuid}&zone-ids={uuid,uuid,uuid}
```

**Backend Implementation:**
```sql
-- Join to customers and filter by zone
WHERE transactions.customer_id IN (
  SELECT c.id FROM customers c
  JOIN locations l ON l.id = c.location_id
  WHERE l.zone_id = ANY(ARRAY[zone_ids_param])
)
```

#### 5.2.3 Deposits

```http
GET /api/deposits?assembly-id={uuid}&zone-ids={uuid,uuid,uuid}
```

**Backend Implementation:**
```sql
-- Filter by collector's zone assignment
WHERE deposits.user_id IN (
  SELECT user_id FROM user_zone_permissions
  WHERE entity_type = 'zone'
    AND entity_id = ANY(ARRAY[zone_ids_param])
)
```

#### 5.2.4 Locations

```http
GET /api/locations?assembly-id={uuid}&zone-ids={uuid,uuid,uuid}
```

**Backend Implementation:**
```sql
WHERE locations.zone_id = ANY(ARRAY[zone_ids_param])
```

#### 5.2.5 Dashboard Stats

```http
GET /api/reports/dashboard-stats?assembly-id={uuid}&zone-ids={uuid,uuid,uuid}
```

**Backend Implementation:**
- All aggregation queries must add zone filtering to underlying queries
- Example: `COUNT(*) FROM customers WHERE location_id IN (SELECT id FROM locations WHERE zone_id = ANY(...))`

#### 5.2.6 Officer Performance

```http
GET /api/reports/officer-performance?assembly-id={uuid}&zone-ids={uuid,uuid,uuid}
```

**Backend Implementation:**
```sql
-- Only show officers assigned to these zones
WHERE users.id IN (
  SELECT user_id FROM user_zone_permissions
  WHERE entity_type = 'zone'
    AND entity_id = ANY(ARRAY[zone_ids_param])
)
-- AND filter their transaction data by zone
AND transactions.customer_id IN (...)
```

### 5.3 Complete List of Endpoints Requiring Zone Filtering

| Endpoint | Filter Method | Priority |
|----------|--------------|----------|
| `/api/customers` | `location.zone_id` | P0 |
| `/api/transactions` | `customer.location.zone_id` | P0 |
| `/api/deposits` | `user.zone_id` or zones | P0 |
| `/api/locations` | Direct `zone_id` | P0 |
| `/api/zones` | Direct `id` | P0 |
| `/api/users` | `zone_id` in permissions | P1 |
| `/api/reports/dashboard-stats` | All aggregations | P0 |
| `/api/reports/revenue` | Transaction-based | P0 |
| `/api/reports/outstanding-deposits` | Deposit-based | P0 |
| `/api/reports/officer-performance` | User + transaction | P0 |
| `/api/reports/customer-payment-status` | Customer-based | P0 |
| `/api/gps-transactions` | Transaction-based | P1 |
| `/api/reports/officer-paths` | User-based | P1 |

---

## 6. Frontend Changes

### 6.1 AuthContext Enhancement

**File:** `src/contexts/AuthContext.tsx`

```typescript
interface User {
  id: string;
  'assembly-id': string;
  'first-name': string;
  'last-name': string;
  email?: string;
  phone: string;
  role: 'admin' | 'supervisor' | 'officer';
  'is-active': boolean;

  // NEW FIELDS
  'access-type': 'global' | 'custom';
  'accessible-zones': AccessibleZone[];
  'accessible-zone-ids': string[];
  'accessible-community-ids': string[];
}

interface AccessibleZone {
  'zone-id': string;
  'zone-name': string;
  'community-id': string | null;
  'community-name': string | null;
  'access-source': 'global' | 'explicit_zone' | string; // 'community:Name'
}

// Add to AuthContext
const AuthContext = createContext<{
  user: User | null;
  // ... existing methods
  hasZoneAccess: (zoneId: string) => boolean;
  getAccessibleZones: () => AccessibleZone[];
  isGlobalAccess: () => boolean;
}>({...});
```

**Implementation:**
```typescript
// After login, fetch accessible zones
const login = async (email: string, password: string) => {
  const response = await api.loginWeb(email, password);
  const userData = response.user;

  // Fetch accessible zones
  if (userData['access-type'] === 'custom') {
    const zonesData = await api.getUserAccessibleZones(userData.id);
    userData['accessible-zones'] = zonesData.zones;
    userData['accessible-zone-ids'] = zonesData.zones.map(z => z['zone-id']);
    userData['accessible-community-ids'] = [
      ...new Set(zonesData.zones.map(z => z['community-id']).filter(Boolean))
    ];
  } else {
    // Global access - fetch all zones
    const allZones = await api.getZones({ 'assembly-id': userData['assembly-id'] });
    userData['accessible-zones'] = allZones.map(z => ({
      'zone-id': z.id,
      'zone-name': z.name,
      'community-id': z['community-id'],
      'community-name': z['community-name'],
      'access-source': 'global'
    }));
    userData['accessible-zone-ids'] = allZones.map(z => z.id);
  }

  setUser(userData);
  localStorage.setItem('auth_user', JSON.stringify(userData));
};

const hasZoneAccess = (zoneId: string): boolean => {
  if (!user) return false;
  if (user['access-type'] === 'global') return true;
  return user['accessible-zone-ids'].includes(zoneId);
};

const isGlobalAccess = (): boolean => {
  return user?.['access-type'] === 'global';
};
```

### 6.2 Zone Filtering Utility Functions

**New File:** `src/lib/zoneFilter.ts`

```typescript
import { User, AccessibleZone } from '@/types/dashboard';

/**
 * Get zone IDs for API filtering
 */
export function getZoneIdsForAPI(user: User | null): string[] | null {
  if (!user) return null;
  if (user['access-type'] === 'global') return null; // Don't filter - return all
  return user['accessible-zone-ids'];
}

/**
 * Filter customers by accessible zones
 */
export function filterCustomersByZone<T extends { 'zone-id'?: string; 'zone-name'?: string }>(
  customers: T[],
  user: User | null
): T[] {
  if (!user || user['access-type'] === 'global') return customers;

  const accessibleZoneIds = new Set(user['accessible-zone-ids']);
  const accessibleZoneNames = new Set(
    user['accessible-zones'].map(z => z['zone-name'])
  );

  return customers.filter(c => {
    if (c['zone-id']) return accessibleZoneIds.has(c['zone-id']);
    if (c['zone-name']) return accessibleZoneNames.has(c['zone-name']);
    return false; // No zone info - exclude for safety
  });
}

/**
 * Filter locations by accessible zones
 */
export function filterLocationsByZone<T extends { 'zone-id': string }>(
  locations: T[],
  user: User | null
): T[] {
  if (!user || user['access-type'] === 'global') return locations;

  const accessibleZoneIds = new Set(user['accessible-zone-ids']);
  return locations.filter(loc => accessibleZoneIds.has(loc['zone-id']));
}

/**
 * Filter transactions by customer's zone
 */
export async function filterTransactionsByZone<T extends { 'customer-id': string }>(
  transactions: T[],
  user: User | null,
  customerZoneMap: Map<string, string> // customer-id -> zone-id
): Promise<T[]> {
  if (!user || user['access-type'] === 'global') return transactions;

  const accessibleZoneIds = new Set(user['accessible-zone-ids']);

  return transactions.filter(txn => {
    const zoneId = customerZoneMap.get(txn['customer-id']);
    return zoneId && accessibleZoneIds.has(zoneId);
  });
}

/**
 * Check if user can edit entity in zone
 */
export function canEditInZone(user: User | null, zoneId: string): boolean {
  if (!user) return false;
  if (user['access-type'] === 'global') return true;
  return user['accessible-zone-ids'].includes(zoneId);
}

/**
 * Get zone options for dropdowns (filtered by access)
 */
export function getAccessibleZoneOptions(
  allZones: Array<{ id: string; name: string }>,
  user: User | null
): Array<{ value: string; label: string }> {
  if (!user || user['access-type'] === 'global') {
    return allZones.map(z => ({ value: z.id, label: z.name }));
  }

  const accessibleIds = new Set(user['accessible-zone-ids']);
  return allZones
    .filter(z => accessibleIds.has(z.id))
    .map(z => ({ value: z.id, label: z.name }));
}
```

### 6.3 Page-Level Changes

#### 6.3.1 TicketCustomersPage

**File:** `src/components/pages/TicketCustomersPage.tsx`

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { getZoneIdsForAPI, filterCustomersByZone } from '@/lib/zoneFilter';

export const TicketCustomersPage = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Get zone filter for API
        const zoneIds = getZoneIdsForAPI(user);

        // Call API with zone filtering
        const params: any = {
          'assembly-id': user['assembly-id']
        };

        // If custom access, add zone filtering
        if (zoneIds && zoneIds.length > 0) {
          // Backend will implement zone-ids parameter
          params['zone-ids'] = zoneIds.join(',');
        }

        const data = await api.getCustomers(params);

        // Client-side filter as backup (if backend not ready yet)
        const filtered = filterCustomersByZone(data, user);

        setCustomers(filtered);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ... rest of component
};
```

**Changes Required:**
- Line 127: Add zone filtering to `fetchData`
- Line 234: Remove manual zone filter dropdown (or make it secondary filter within accessible zones)
- Line 421: Update export to use filtered data
- Add loading state while zones are being resolved

#### 6.3.2 TicketPaymentsPage

**File:** `src/components/pages/TicketPaymentsPage.tsx`

```typescript
useEffect(() => {
  const fetchData = async () => {
    if (!user) return;

    try {
      const zoneIds = getZoneIdsForAPI(user);

      const params: any = {
        'assembly-id': user['assembly-id'],
        'start-date': dateRange.start,
        'end-date': dateRange.end
      };

      if (zoneIds && zoneIds.length > 0) {
        params['zone-ids'] = zoneIds.join(',');
      }

      const txns = await api.getTransactions(params);
      setTransactions(txns);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [user, dateRange]);
```

#### 6.3.3 PerformancePage (Dashboard Stats)

**File:** `src/components/pages/PerformancePage.tsx`

```typescript
useEffect(() => {
  const fetchStats = async () => {
    if (!user) return;

    const zoneIds = getZoneIdsForAPI(user);

    const params: any = {
      'assembly-id': user['assembly-id'],
      'start-date': dateRange.start,
      'end-date': dateRange.end
    };

    if (zoneIds && zoneIds.length > 0) {
      params['zone-ids'] = zoneIds.join(',');
    }

    const stats = await api.getDashboardStats(params);

    // All aggregations in stats are already filtered by backend
    setDashboardData(stats);
  };

  fetchStats();
}, [user, dateRange]);
```

#### 6.3.4 StaffPage

**File:** `src/components/pages/StaffPage.tsx`

```typescript
useEffect(() => {
  const fetchStaff = async () => {
    if (!user) return;

    const zoneIds = getZoneIdsForAPI(user);

    const params: any = {
      'assembly-id': user['assembly-id']
    };

    // Filter staff to only show those in accessible zones
    if (zoneIds && zoneIds.length > 0) {
      params['zone-ids'] = zoneIds.join(',');
    }

    const staff = await api.getUsers(params);
    setStaffList(staff);
  };

  fetchStaff();
}, [user]);
```

#### 6.3.5 AddStaffPage - Zone Assignment Restrictions

**File:** `src/components/pages/AddStaffPage.tsx`

```typescript
// When rendering HierarchicalAccess component
<HierarchicalAccess
  label="Zone Assignment (Access Permissions)"
  placeholder="Select access level and permissions"
  value={formData.accessPermissions}
  onChange={(value) => handleInputChange('accessPermissions', value)}

  // NEW: Pass user's accessible zones to restrict assignment
  allowedZones={user?.['accessible-zone-ids']}
  allowedCommunities={user?.['accessible-community-ids']}

  // Only admins can assign global access
  allowGlobalAccess={user?.role === 'admin'}
/>
```

**HierarchicalAccess Component Changes:**
- Add `allowedZones` and `allowedCommunities` props
- Filter tree to only show nodes user can assign
- Disable global access radio if `allowGlobalAccess === false`

### 6.4 Complete Page Change Matrix

| Page | API Changes | Client Filter | Export Update | Priority |
|------|-------------|---------------|---------------|----------|
| TicketCustomersPage | Add zone-ids param | filterCustomersByZone | Yes | P0 |
| TicketPaymentsPage | Add zone-ids param | filterTransactionsByZone | Yes | P0 |
| BankDepositsListPage | Add zone-ids param | Filter by zone-name | Yes | P0 |
| PerformancePage | Add zone-ids param | Backend only | Yes | P0 |
| DebtPage | Add zone-ids param | Backend only | Yes | P0 |
| LocationPage | Add zone-ids param | filterLocationsByZone | Yes | P0 |
| ZonesPage | Add zone-ids param | Direct filter | Yes | P1 |
| StaffPage | Add zone-ids param | Filter by zone-id | Yes | P1 |
| CustomerLocationsPage | Add zone-ids param | filterCustomersByZone | N/A | P1 |
| CollectorLocationsPage | Add zone-ids param | Transaction filter | N/A | P1 |
| RevenueOfficerPerformancePage | Add zone-ids param | Backend only | Yes | P1 |
| All Detail Pages (15+) | Inherit from parent | Various | Yes | P2 |
| All Status Pages (8+) | Add zone-ids param | Various | Yes | P2 |
| Edit Pages (6+) | Access check only | canEditInZone | N/A | P2 |

---

## 7. Edge Cases & Business Rules

### 7.1 Edge Case Handling

| Scenario | Expected Behavior | Implementation |
|----------|-------------------|----------------|
| User has no zone assignments | Cannot access any data (empty lists) | Return empty arrays from resolution function |
| Zone has no community | User can still be assigned explicitly | Allow null community_id in zones table |
| Community is deactivated | Inherited permissions remain active | No automatic revocation (manual cleanup) |
| Zone is deactivated | All explicit permissions revoked automatically | Trigger on zones.is_active = false |
| Zone deleted while user assigned | Permissions auto-revoked, audit logged | ON DELETE trigger |
| User assigned to Zone A, Zone A moved, then user assigned to new community | User has dual access (explicit + inherited) | Both permissions coexist |
| Admin assigns user to zone outside their own access | Blocked (403 Forbidden) | Backend validation |
| User tries to view customer in restricted zone | 404 Not Found (not 403) | Don't leak existence |
| User with global access is downgraded | All permissions cleared, custom assignments created | Manual admin action required |
| Circular permission grants | Not possible (no hierarchy in permissions) | N/A |
| Zone moved to community, then back to original | New permission record created (audit trail preserved) | Standard flow |
| User assigned to 100+ zones | Performance degradation possible | Use batch queries, cache zone lists |
| API called without zone-ids param by custom user | Backend infers from auth token | Middleware extracts user's zones |

### 7.2 Validation Rules

#### Backend Validation

1. **User Assignment:**
   - Cannot assign zones/communities from different assemblies
   - Cannot assign if access_type = 'global'
   - Cannot assign if assignee has higher privilege than assigner
   - Cannot assign zones outside assigner's own accessible zones (unless assigner is global)

2. **Zone Movement:**
   - Can only move zones within same assembly
   - Must have valid community_id or NULL
   - Audit log must be created

3. **Community Deletion:**
   - Must have no active zones (or cascade deactivate zones)
   - Warn about users with assignments

#### Frontend Validation

1. **AddStaffPage:**
   - Disable communities/zones user cannot assign
   - Show warning if assigning broader access than self
   - Require confirmation for global access

2. **EditStaffPage:**
   - Cannot reduce own permissions
   - Cannot remove zones from users with higher role

3. **Edit Entity Pages:**
   - Check `canEditInZone()` before allowing form submission
   - Disable edit button if no access

### 7.3 Error Handling

| Error | HTTP Code | User Message | Log Action |
|-------|-----------|--------------|------------|
| Zone access denied | 404 | "Resource not found" | Log attempt with user ID |
| No zone assignments | 200 (empty) | "No data available in your assigned zones" | Info log |
| Zone resolution failure | 500 | "Error loading data" | Error log with stack trace |
| Invalid zone ID in assignment | 400 | "Invalid zone selection" | Warn log |
| Permission grant fails | 500 | "Failed to grant permission" | Error log |
| Concurrent zone movement | 409 | "Zone was modified, please refresh" | Warn log |

---

## 8. Migration Strategy

### 8.1 Database Migration Steps

#### Step 1: Create New Tables (Non-Breaking)
```sql
-- Run in production during maintenance window
BEGIN;

-- Create communities table
CREATE TABLE communities (...);

-- Create user_zone_permissions table
CREATE TABLE user_zone_permissions (...);

-- Create permission_audit_log table
CREATE TABLE permission_audit_log (...);

COMMIT;
```

#### Step 2: Add New Columns (Non-Breaking)
```sql
BEGIN;

-- Add community_id to zones
ALTER TABLE zones ADD COLUMN community_id UUID REFERENCES communities(id);

-- Rename old field
ALTER TABLE users RENAME COLUMN zone_id TO legacy_zone_id;

-- Add new access_type field
ALTER TABLE users ADD COLUMN access_type VARCHAR(20) DEFAULT 'global';

COMMIT;
```

#### Step 3: Data Migration Script

```sql
BEGIN;

-- Migrate existing zone assignments
INSERT INTO user_zone_permissions (
  user_id,
  entity_type,
  entity_id,
  granted_explicitly,
  granted_at,
  notes
)
SELECT
  id AS user_id,
  'zone' AS entity_type,
  legacy_zone_id AS entity_id,
  true AS granted_explicitly,
  created_at AS granted_at,
  'Migrated from legacy zone_id field' AS notes
FROM users
WHERE legacy_zone_id IS NOT NULL;

-- Set access_type based on legacy_zone_id
UPDATE users
SET access_type = CASE
  WHEN legacy_zone_id IS NULL THEN 'global'
  ELSE 'custom'
END;

-- Log migration
INSERT INTO permission_audit_log (
  user_id, action, entity_type, entity_id, entity_name,
  reason, performed_at
)
SELECT
  u.id,
  'migration_from_legacy',
  'zone',
  u.legacy_zone_id,
  z.name,
  'Automatic migration from single zone_id field',
  NOW()
FROM users u
JOIN zones z ON z.id = u.legacy_zone_id
WHERE u.legacy_zone_id IS NOT NULL;

COMMIT;
```

#### Step 4: Create Functions and Triggers

```sql
-- Create resolve_user_accessible_zones function
CREATE OR REPLACE FUNCTION resolve_user_accessible_zones(...)...;

-- Create triggers
CREATE TRIGGER zones_community_change_trigger...;
CREATE TRIGGER zones_creation_trigger...;
CREATE TRIGGER zones_deletion_trigger...;
```

#### Step 5: Populate Communities (Manual/Script)

```sql
-- Create initial communities based on existing zone groupings
-- This may require business input
INSERT INTO communities (assembly_id, name, description)
VALUES
  ('{assembly-id}', 'Adum Community', 'Central business district'),
  ('{assembly-id}', 'Kejetia Community', 'Market area'),
  ...;

-- Assign zones to communities
UPDATE zones SET community_id = '{community-id}' WHERE name IN (...);
```

#### Step 6: API Deployment

1. Deploy backend with new endpoints (communities, permissions)
2. Deploy backward-compatible zone filtering (if zone-ids not provided, behave as before)
3. Test with existing users (should work as before)
4. Gradually enable zone filtering for custom-access users

#### Step 7: Frontend Deployment

1. Deploy new AuthContext with zone resolution
2. Deploy zone filtering utilities
3. Deploy page updates (one by one, feature flags if possible)
4. Monitor errors and performance

#### Step 8: Cleanup (After 2-4 weeks)

```sql
-- Drop legacy column
ALTER TABLE users DROP COLUMN legacy_zone_id;
```

### 8.2 Rollback Plan

**If critical issues arise:**

1. **Immediate:** Disable zone filtering in API (remove zone-ids param handling)
2. **Short-term:** Revert frontend to previous version
3. **Database:** Keep new tables (no data loss), keep legacy_zone_id column
4. **Long-term:** Fix issues, re-deploy with fixes

**Critical rollback triggers:**
- Dashboard stats showing 0 data for users who should see data
- Performance degradation > 50%
- >5% error rate on any endpoint
- Data leakage (users seeing zones they shouldn't)

### 8.3 Testing Before Migration

| Test Case | Expected Result | Validation |
|-----------|----------------|------------|
| Global user sees all data | All zones visible | Compare counts before/after |
| Custom user with 1 zone sees only that zone's data | Filtered correctly | Manual verification |
| Create new zone in community with assigned users | Users auto-granted | Check audit log |
| Move zone between communities | Correct permissions updated | Check affected users |
| Delete zone | All permissions revoked | Check user_zone_permissions |
| User with no assignments | Empty lists, no errors | Test all pages |
| Performance test with 1000 zones | < 2s load time | Load testing |

---

## 9. Testing Requirements

### 9.1 Unit Tests

#### Backend - Permission Resolution

```clojure
(deftest test-resolve-accessible-zones
  (testing "Global user sees all zones"
    (let [user {:id user-id :access-type "global"}
          zones (resolve-user-accessible-zones user-id)]
      (is (= 50 (count zones)))))

  (testing "Custom user with community sees all community zones"
    (let [user {:id user-id :access-type "custom"}
          _ (grant-permission user-id "community" community-id)
          zones (resolve-user-accessible-zones user-id)]
      (is (= 6 (count zones))))) ; Adum Community has 6 zones

  (testing "Custom user with explicit zone sees only that zone"
    (let [user {:id user-id :access-type "custom"}
          _ (grant-permission user-id "zone" zone-id)
          zones (resolve-user-accessible-zones user-id)]
      (is (= 1 (count zones))))))
```

#### Backend - Zone Movement

```clojure
(deftest test-zone-movement-permissions
  (testing "User with community access loses zone when moved"
    (let [user-id (create-test-user)
          community-a (create-test-community "Community A")
          community-b (create-test-community "Community B")
          zone-1 (create-test-zone "Zone 1" community-a)
          _ (grant-permission user-id "community" community-a)]

      ; User can access zone-1
      (is (contains? (get-accessible-zone-ids user-id) zone-1))

      ; Move zone to community B
      (update-zone zone-1 {:community-id community-b})

      ; User can no longer access zone-1
      (is (not (contains? (get-accessible-zone-ids user-id) zone-1)))))

  (testing "User with explicit zone access retains when moved"
    (let [user-id (create-test-user)
          zone-1 (create-test-zone "Zone 1" community-a)
          _ (grant-permission user-id "zone" zone-1)]

      ; Move zone
      (update-zone zone-1 {:community-id community-b})

      ; User still has access
      (is (contains? (get-accessible-zone-ids user-id) zone-1)))))
```

#### Frontend - Filtering Utilities

```typescript
describe('zoneFilter utilities', () => {
  test('filterCustomersByZone - global access returns all', () => {
    const user: User = {
      'access-type': 'global',
      'accessible-zone-ids': []
    };
    const customers = [
      { id: '1', 'zone-name': 'Zone A' },
      { id: '2', 'zone-name': 'Zone B' }
    ];

    const filtered = filterCustomersByZone(customers, user);
    expect(filtered).toHaveLength(2);
  });

  test('filterCustomersByZone - custom access filters correctly', () => {
    const user: User = {
      'access-type': 'custom',
      'accessible-zone-ids': ['zone-a-id'],
      'accessible-zones': [
        { 'zone-id': 'zone-a-id', 'zone-name': 'Zone A', ... }
      ]
    };
    const customers = [
      { id: '1', 'zone-name': 'Zone A' },
      { id: '2', 'zone-name': 'Zone B' }
    ];

    const filtered = filterCustomersByZone(customers, user);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });
});
```

### 9.2 Integration Tests

#### API Endpoint Tests

```bash
# Test customer endpoint with zone filtering
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3006/api/customers?assembly-id=$ASSEMBLY&zone-ids=zone1,zone2"

# Verify response contains only customers from zone1 and zone2

# Test dashboard stats with zone filtering
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3006/api/reports/dashboard-stats?assembly-id=$ASSEMBLY&zone-ids=zone1"

# Verify aggregations are correct for filtered data
```

#### Permission Inheritance Tests

```bash
# 1. Create user with community assignment
POST /api/users/{user-id}/permissions/grant
{ "entity-type": "community", "entity-id": "{community-id}" }

# 2. Get accessible zones - should include all zones in community
GET /api/users/{user-id}/accessible-zones

# 3. Create new zone in that community
POST /api/zones
{ "name": "New Zone 7", "community-id": "{community-id}" }

# 4. Get accessible zones again - should now include Zone 7
GET /api/users/{user-id}/accessible-zones

# 5. Verify audit log shows auto-grant
GET /api/users/{user-id}/permission-audit
```

### 9.3 E2E Tests (Frontend)

#### Test Scenario 1: Restricted User Can Only See Their Data

```typescript
test('Restricted user sees only their zones', async () => {
  // Login as user with access to only Zone 1
  await loginAs('officer@example.com', 'password');

  // Navigate to customers page
  await page.goto('/dashboard#customers');

  // Wait for data load
  await page.waitForSelector('[data-testid="customer-row"]');

  // Get all visible customers
  const customers = await page.$$('[data-testid="customer-row"]');

  // Verify all customers are from Zone 1
  for (const customer of customers) {
    const zoneName = await customer.$eval('[data-testid="zone-name"]', el => el.textContent);
    expect(zoneName).toBe('Zone 1');
  }

  // Verify zone dropdown only shows Zone 1
  const zoneOptions = await page.$$('[data-testid="zone-filter"] option');
  expect(zoneOptions).toHaveLength(2); // "All" + "Zone 1"
});
```

#### Test Scenario 2: Dashboard Stats Match Zone Filter

```typescript
test('Dashboard stats only include accessible zones', async () => {
  await loginAs('supervisor@example.com', 'password'); // Has Zones 1-3

  await page.goto('/dashboard#performance');

  // Get total customers stat
  const totalCustomers = await page.$eval(
    '[data-testid="total-customers"]',
    el => parseInt(el.textContent)
  );

  // Manually query API to verify
  const apiCustomers = await fetch('/api/customers?zone-ids=zone1,zone2,zone3');
  const apiData = await apiCustomers.json();

  expect(totalCustomers).toBe(apiData.length);
});
```

### 9.4 Performance Tests

#### Zone Resolution Performance

```typescript
test('Zone resolution completes in < 100ms', async () => {
  const start = Date.now();

  const zones = await api.getUserAccessibleZones(userId);

  const duration = Date.now() - start;
  expect(duration).toBeLessThan(100);
});
```

#### Large Zone Assignment

```typescript
test('User with 100 zones loads dashboard in < 3s', async () => {
  // Create user with 100 zone assignments
  const userId = await createUserWith100Zones();

  await loginAs(userId);

  const start = Date.now();
  await page.goto('/dashboard#performance');
  await page.waitForSelector('[data-testid="dashboard-loaded"]');
  const duration = Date.now() - start;

  expect(duration).toBeLessThan(3000);
});
```

### 9.5 Security Tests

#### Test Unauthorized Zone Access

```bash
# User has access to zone1 only
# Try to access customer in zone2

curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3006/api/customers/customer-in-zone2"

# Expected: 404 Not Found (not 403, to avoid leaking existence)
```

#### Test Permission Escalation

```bash
# User with zone1 access tries to grant zone2 access to another user

curl -X POST -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3006/api/users/{other-user}/permissions/grant" \
  -d '{"entity-type": "zone", "entity-id": "zone2"}'

# Expected: 403 Forbidden
```

---

## 10. Implementation Phases

### Phase 0: Preparation (Week 1)
- [ ] Review and approve this specification
- [ ] Set up feature flag for gradual rollout
- [ ] Prepare test data and test accounts
- [ ] Create development branches

### Phase 1: Backend Foundation (Week 2-3)

**Database:**
- [ ] Create communities table
- [ ] Create user_zone_permissions table
- [ ] Create permission_audit_log table
- [ ] Add community_id to zones table
- [ ] Add access_type to users table
- [ ] Create migration script for existing data
- [ ] Create resolve_user_accessible_zones function
- [ ] Create zone movement triggers
- [ ] Create zone deletion triggers

**API Endpoints:**
- [ ] Implement /api/communities CRUD
- [ ] Implement /api/users/{id}/permissions/grant
- [ ] Implement /api/users/{id}/permissions/revoke
- [ ] Implement /api/users/{id}/accessible-zones
- [ ] Implement /api/users/{id}/permission-audit

**Testing:**
- [ ] Unit tests for permission resolution
- [ ] Unit tests for zone movement logic
- [ ] Integration tests for new endpoints
- [ ] Performance tests for zone resolution

**Deployment:**
- [ ] Deploy to staging environment
- [ ] Run migration on staging data
- [ ] Verify data integrity
- [ ] Document any issues

### Phase 2: API Zone Filtering (Week 4-5)

**Modify Endpoints:**
- [ ] Add zone-ids parameter to /api/customers
- [ ] Add zone-ids parameter to /api/transactions
- [ ] Add zone-ids parameter to /api/deposits
- [ ] Add zone-ids parameter to /api/locations
- [ ] Add zone-ids parameter to /api/zones
- [ ] Add zone-ids parameter to /api/users
- [ ] Add zone-ids parameter to /api/reports/dashboard-stats
- [ ] Add zone-ids parameter to /api/reports/revenue
- [ ] Add zone-ids parameter to /api/reports/officer-performance
- [ ] Add zone-ids parameter to /api/reports/customer-payment-status
- [ ] Add zone-ids parameter to /api/gps-transactions
- [ ] Add zone-ids parameter to /api/reports/officer-paths

**Middleware:**
- [ ] Create middleware to auto-inject user's zone-ids if not provided
- [ ] Add authorization checks for zone access
- [ ] Add logging for filtered requests

**Testing:**
- [ ] Integration tests for each filtered endpoint
- [ ] Performance tests for filtered queries
- [ ] Security tests for unauthorized access

**Deployment:**
- [ ] Deploy to staging
- [ ] Test with various user types
- [ ] Monitor performance metrics
- [ ] Deploy to production with feature flag OFF

### Phase 3: Frontend Foundation (Week 6)

**AuthContext:**
- [ ] Extend User interface with access-type and accessible-zones
- [ ] Implement fetchAccessibleZones on login
- [ ] Add hasZoneAccess() method
- [ ] Add getAccessibleZones() method
- [ ] Add isGlobalAccess() method

**Utilities:**
- [ ] Create src/lib/zoneFilter.ts
- [ ] Implement getZoneIdsForAPI()
- [ ] Implement filterCustomersByZone()
- [ ] Implement filterLocationsByZone()
- [ ] Implement filterTransactionsByZone()
- [ ] Implement canEditInZone()
- [ ] Implement getAccessibleZoneOptions()

**Testing:**
- [ ] Unit tests for all filter utilities
- [ ] Test with mock users (global, custom with 1 zone, custom with multiple)

**Deployment:**
- [ ] Deploy to staging
- [ ] Verify AuthContext loads correctly
- [ ] Test zone resolution performance

### Phase 4: Critical Pages (Week 7-8)

**Priority 0 Pages:**
- [ ] TicketCustomersPage - add zone filtering
- [ ] TicketPaymentsPage - add zone filtering
- [ ] BankDepositsListPage - add zone filtering
- [ ] PerformancePage - add zone filtering
- [ ] DebtPage - add zone filtering
- [ ] LocationPage - add zone filtering

**For Each Page:**
- [ ] Add API zone filtering to data fetch
- [ ] Add client-side filter as backup
- [ ] Update export functions
- [ ] Add loading states
- [ ] Update error handling
- [ ] Add empty state message

**Testing:**
- [ ] E2E test for each page with restricted user
- [ ] Verify exports contain only filtered data
- [ ] Test with global access user (should see all)
- [ ] Test with no-zone user (should see empty)

**Deployment:**
- [ ] Deploy to staging
- [ ] UAT with test users
- [ ] Enable feature flag for beta users
- [ ] Monitor for 1 week

### Phase 5: Secondary Pages (Week 9-10)

**Priority 1 Pages:**
- [ ] ZonesPage
- [ ] StaffPage
- [ ] RevenueOfficerPerformancePage
- [ ] CustomerLocationsPage
- [ ] CollectorLocationsPage
- [ ] CollectorPathsPage

**Dashboard Detail Pages (15+):**
- [ ] DashboardDetailsCustomerDebtPage
- [ ] DashboardDetailsPaidCustomersPage
- [ ] DashboardDetailsNonPaidCustomersPage
- [ ] DashboardDetailsCustomersWithNoPaymentsPage
- [ ] DashboardDetailsInactiveCustomersPage
- [ ] DashboardDetailsCustomersInactiveThisYearPage
- [ ] DashboardDetailsCounterfeitedTicketsPage
- [ ] (8 more detail pages)

**Same process as Phase 4**

**Deployment:**
- [ ] Deploy to staging
- [ ] Enable for all beta users
- [ ] Monitor for 1 week

### Phase 6: Status & Report Pages (Week 11)

**Priority 2 Pages:**
- [ ] CustomerPaymentStatusPage
- [ ] CustomerPaymentStatusPaidCustomersPage
- [ ] CustomerPaymentStatusCustomersWithNegativeBalancesPage
- [ ] CustomerPaymentStatusPartialPaymentPage
- [ ] CustomerPaymentStatusVisitedNoPaymentPage
- [ ] CustomerPaymentStatusNotVisitedPage
- [ ] CustomerVisitStatusNoOneHomePage
- [ ] CustomerVisitStatusCancelledStoppedPage
- [ ] CustomerVisitStatusExcusesPage
- [ ] CustomerVisitStatusOtherPage

**Deployment:**
- [ ] Deploy to staging
- [ ] Enable for all users (feature flag ON globally)

### Phase 7: Edit & Form Pages (Week 12)

**Edit Pages:**
- [ ] EditStaffPage - restrict editing
- [ ] EditCustomerPage - restrict editing
- [ ] EditLocationPage - restrict editing
- [ ] EditTicketTypePage - restrict editing (if needed)
- [ ] EditCustomerTypePage - restrict editing (if needed)
- [ ] EditZonePage - restrict editing

**Add Pages:**
- [ ] AddStaffPage - restrict zone assignment dropdowns
- [ ] Modify HierarchicalAccess component to support restrictions
- [ ] Update CreateUserPage (if exists)

**Testing:**
- [ ] Test user cannot edit entities outside zones
- [ ] Test user cannot assign zones they don't have access to
- [ ] Test admin can still do everything

**Deployment:**
- [ ] Deploy to staging
- [ ] Deploy to production

### Phase 8: Cleanup & Optimization (Week 13)

**Database:**
- [ ] Drop legacy_zone_id column from users
- [ ] Analyze slow queries, add indexes if needed
- [ ] Archive old audit logs (if > 2 years)

**Code:**
- [ ] Remove feature flags
- [ ] Remove client-side filters (if backend proven reliable)
- [ ] Refactor any duplicated filtering logic
- [ ] Update documentation

**Testing:**
- [ ] Full regression test suite
- [ ] Performance benchmarks
- [ ] Security audit

**Deployment:**
- [ ] Final production deployment
- [ ] Monitor for 2 weeks
- [ ] Close tickets

### Phase 9: Documentation & Training (Week 14)

**Documentation:**
- [ ] Update API documentation
- [ ] Update user guide
- [ ] Create admin guide for managing permissions
- [ ] Document troubleshooting steps

**Training:**
- [ ] Train admin users on permission management
- [ ] Train support staff on common issues
- [ ] Create video tutorials

**Monitoring:**
- [ ] Set up alerts for permission errors
- [ ] Create dashboard for permission audit logs
- [ ] Monitor performance metrics

---

## 11. Appendix

### A. Sample API Requests & Responses

#### Get User's Accessible Zones
```http
GET /api/users/123e4567-e89b-12d3-a456-426614174000/accessible-zones
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200 OK:
{
  "user-id": "123e4567-e89b-12d3-a456-426614174000",
  "access-type": "custom",
  "zones": [
    {
      "zone-id": "zone-1-uuid",
      "zone-name": "Zone 1",
      "community-id": "community-a-uuid",
      "community-name": "Adum Community",
      "access-source": "explicit_zone",
      "granted-at": "2025-01-01T00:00:00Z"
    },
    {
      "zone-id": "zone-2-uuid",
      "zone-name": "Zone 2",
      "community-id": "community-a-uuid",
      "community-name": "Adum Community",
      "access-source": "community:Adum Community",
      "granted-at": "2025-01-01T00:00:00Z"
    }
  ],
  "zone-count": 2,
  "community-count": 1
}
```

#### Grant Permission
```http
POST /api/users/123e4567-e89b-12d3-a456-426614174000/permissions/grant
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "entity-type": "community",
  "entity-id": "community-b-uuid",
  "granted-by": "admin-user-uuid",
  "notes": "Expanding coverage area"
}

Response 201 Created:
{
  "id": "permission-uuid",
  "user-id": "123e4567-e89b-12d3-a456-426614174000",
  "entity-type": "community",
  "entity-id": "community-b-uuid",
  "granted-explicitly": true,
  "granted-at": "2025-01-12T14:30:00Z",
  "granted-by": "admin-user-uuid",
  "zones-granted": [
    {
      "zone-id": "zone-7-uuid",
      "zone-name": "Zone 7"
    },
    {
      "zone-id": "zone-8-uuid",
      "zone-name": "Zone 8"
    }
  ]
}
```

#### Get Customers with Zone Filter
```http
GET /api/customers?assembly-id=assembly-uuid&zone-ids=zone1,zone2,zone3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200 OK:
[
  {
    "customer-id": "cust-1-uuid",
    "phone": "0244989297",
    "location-id": "loc-1-uuid",
    "location-name": "Market Street",
    "zone-id": "zone1",
    "zone-name": "Zone 1",
    "customer-type-id": "type-uuid",
    "is-active": true
  },
  ...
]
```

### B. Database Schema Diagram

```
┌─────────────────┐
│   assemblies    │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐         ┌──────────────────────┐
│   communities   │         │   users              │
│                 │         │                      │
│ - id (PK)       │         │ - id (PK)            │
│ - assembly_id   │         │ - assembly_id        │
│ - name          │         │ - access_type        │
│ - is_active     │         │ - (legacy_zone_id)   │
└────────┬────────┘         └──────────┬───────────┘
         │ 1                           │ 1
         │                             │
         │ N                           │ N
┌────────▼────────┐         ┌─────────▼────────────────────┐
│     zones       │◄────────│  user_zone_permissions       │
│                 │         │                              │
│ - id (PK)       │         │ - id (PK)                    │
│ - community_id  │         │ - user_id (FK)               │
│ - name          │         │ - entity_type                │
│ - assembly_id   │         │  ('community', 'zone')       │
│ - is_active     │         │ - entity_id (FK)             │
└────────┬────────┘         │ - granted_explicitly         │
         │ 1                │ - granted_via_community_id   │
         │                  │ - granted_at                 │
         │ N                │ - revoked_at                 │
┌────────▼────────┐         └──────────────────────────────┘
│   locations     │
│                 │
│ - id (PK)       │
│ - zone_id       │
│ - name          │
│ - location_type │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│   customers     │
│                 │
│ - id (PK)       │
│ - location_id   │
│ - phone         │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│  transactions   │
│                 │
│ - id (PK)       │
│ - customer_id   │
│ - user_id       │
│ - amount        │
└─────────────────┘
```

### C. Permission State Machine

```
[User Created]
      │
      ├──> access_type = 'global' ──> [Can Access All Zones]
      │                                      │
      │                                      └──> [No Further Changes Needed]
      │
      └──> access_type = 'custom' ──> [No Access by Default]
                  │
                  ├──> [Grant Community Permission]
                  │         │
                  │         ├──> [Auto-grant all zones in community]
                  │         │
                  │         └──> [Listen for zone additions] ──> [Auto-grant new zones]
                  │
                  └──> [Grant Zone Permission (Explicit)]
                           │
                           └──> [Zone persists even if community changes]

[Zone Movement Event]
      │
      ├──> [Find users with community permission to OLD community]
      │         │
      │         └──> [Auto-revoke unless explicit zone permission]
      │
      └──> [Find users with community permission to NEW community]
                │
                └──> [Auto-grant zone access]

[Zone Deletion Event]
      │
      └──> [Revoke all explicit zone permissions for deleted zone]
```

### D. Glossary

| Term | Definition |
|------|------------|
| **Global Access** | User can access all zones in their assembly, no restrictions |
| **Custom Access** | User can only access specific zones/communities they're assigned to |
| **Explicit Assignment** | User is directly assigned to a specific zone (persists through moves) |
| **Inherited Assignment** | User gains access to zone through community assignment (dynamic) |
| **Zone Movement** | Changing which community a zone belongs to |
| **Access Source** | How user gained access: 'global', 'explicit_zone', or 'community:{name}' |
| **Permission Resolution** | Process of determining all zones a user can access |
| **Audit Trail** | Historical record of permission grants/revocations |
| **Accessible Zones** | Set of zone IDs user is currently allowed to access |
| **Zone Filtering** | Limiting API/UI data to only show data from accessible zones |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-12 | System | Initial specification |

**Review Status:** ✅ Ready for Review
**Approval Pending:** Product Owner, Tech Lead, Backend Team Lead, Frontend Team Lead

---

**END OF SPECIFICATION**
