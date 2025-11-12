# Backend Login Endpoint Update Required

## Issue
The frontend is now using subdomain-based tenant detection (as originally planned), but the current backend login endpoint still requires `assembly-id` to be passed in the request body.

## Current Backend Endpoint

```
POST /api/auth/login/web
Body:
{
  "email": "string",
  "password": "string",
  "assembly-id": "uuid"  // ❌ Should not be required from client
}
```

## Proposed Change

The backend should **automatically determine the assembly-id from the subdomain** in the request headers.

### Option 1: Make assembly-id Optional (Recommended)

```clojure
POST /api/auth/login/web
Body:
{
  "email": "string",
  "password": "string",
  "assembly-id": "uuid (optional)"  // Optional - backend determines from subdomain if not provided
}

Logic:
1. Extract subdomain from request Host header
2. Lookup assembly-id for that subdomain/tenant
3. Use that assembly-id for authentication
4. Return user with correct assembly-id
```

### Option 2: Add Tenant-to-Assembly Lookup Endpoint

Add a new public endpoint (no auth required):

```
GET /api/tenant/assembly-id
Response:
{
  "assembly-id": "uuid",
  "tenant-name": "string"
}
```

Then frontend can:
1. Call this endpoint on page load
2. Get the assembly-id for current subdomain
3. Pass it to login

## Why This Matters

**User Experience**: Users shouldn't need to know their Assembly ID UUID. They just need to visit their subdomain (e.g., `demo.localhost:3006`) and login with email/password.

**Security**: The assembly-id is a system-level identifier that shouldn't be exposed to end users.

**Multi-tenancy**: The subdomain already identifies the tenant, so requiring assembly-id is redundant.

## Current Frontend Implementation

The frontend now:
1. ✅ Auto-detects tenant from subdomain (`demo.localhost` → tenant: "demo")
2. ✅ Displays tenant name on login screen (read-only)
3. ✅ Calls login with only email + password
4. ⚠️ Temporarily passes a placeholder assembly-id (`00000000-0000-0000-0000-000000000000`)

## Example Flow

**User visits:** `http://demo.localhost:3001/login`

**Frontend extracts:** tenant = "demo"

**User enters:**
- Email: admin@demo.com
- Password: password123

**Frontend calls:**
```
POST http://demo.localhost:3006/api/auth/login/web
Body: { "email": "admin@demo.com", "password": "password123" }
```

**Backend should:**
1. See request came from `demo.localhost`
2. Lookup assembly-id for "demo" tenant
3. Authenticate user against that assembly
4. Return tokens + user object with correct assembly-id

## Implementation Suggestions

### In Your Auth Handler:

```clojure
(defn login-web [request]
  (let [body (:body request)
        email (:email body)
        password (:password body)
        assembly-id (or (:assembly-id body)  ; Use provided if exists
                        (get-assembly-id-from-request request))]  ; Otherwise determine from subdomain
    ;; Rest of login logic
    ))

(defn get-assembly-id-from-request [request]
  (let [host (get-in request [:headers "host"])
        subdomain (extract-subdomain host)]
    ;; Lookup assembly-id from subdomain
    (db/get-assembly-id-by-tenant subdomain)))
```

## Testing

After implementing:

1. Visit `http://demo.localhost:3001/login`
2. You should see "Tenant: demo" badge
3. Enter email/password (no Assembly ID field)
4. Should login successfully
5. Subsequent API calls use the correct assembly-id from user object

## Priority

**HIGH** - This blocks the login flow. Frontend is ready but waiting on this backend change.

## Alternative (Quick Fix)

If you can't update the backend immediately, you could:

1. Add a database query to get assembly-id by tenant name
2. Create a public API endpoint: `GET /api/tenant-info`
3. Frontend calls this before login to get assembly-id
4. Pass that to login

But **Option 1** (auto-detect from subdomain) is the cleanest solution.
