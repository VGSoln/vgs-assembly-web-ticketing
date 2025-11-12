# Backend Request: Make assembly-id Optional in Login Endpoint

## Summary
Please make the `assembly-id` field **optional** in the `/api/auth/login/web` endpoint and have the backend **auto-detect it from the subdomain** in the request.

---

## Current Situation

**Frontend is now sending:**
```json
POST /api/auth/login/web
Body:
{
  "email": "admin@demo.com",
  "password": "password123"
  // No assembly-id field
}
```

**Backend currently expects:**
```json
POST /api/auth/login/web
Body:
{
  "email": "admin@demo.com",
  "password": "password123",
  "assembly-id": "uuid"  // ❌ Required field
}
```

---

## What Backend Needs to Do

### 1. Make `assembly-id` Optional in Request Schema

Update the Malli schema for `/api/auth/login/web` to make `assembly-id` optional:

```clojure
;; In src/vgs/api/schemas.clj
(def login-web-request
  [:map
   [:email :string]
   [:password :string]
   [:assembly-id {:optional true} :string]])  ; Make it optional
```

### 2. Determine Assembly ID from Subdomain

When `assembly-id` is not provided in the request, extract it from the subdomain:

```clojure
;; In src/vgs/api/handlers.clj
(defn login-web [{:keys [body headers] :as request}]
  (let [email (:email body)
        password (:password body)
        ;; Get assembly-id from body OR determine from subdomain
        assembly-id (or (:assembly-id body)
                        (get-assembly-id-from-request request))]
    ;; Rest of authentication logic using assembly-id
    (authenticate-user email password assembly-id)))

(defn get-assembly-id-from-request [request]
  "Extract assembly-id from the subdomain in the Host header"
  (let [host (get-in request [:headers "host"])
        subdomain (extract-subdomain host)]
    ;; Query your tenants/assemblies table
    ;; SELECT assembly_id FROM tenants WHERE subdomain = ?
    (db/get-assembly-id-by-subdomain subdomain)))

(defn extract-subdomain [host]
  "Extract subdomain from host header"
  (when host
    (let [hostname (first (clojure.string/split host #":"))  ; Remove port
          parts (clojure.string/split hostname #"\.")]
      (when (> (count parts) 1)
        (first parts)))))  ; Returns "demo" from "demo.localhost"
```

### 3. Add Database Query (if needed)

If you don't already have a mapping of subdomain → assembly-id:

```sql
-- Option A: Add subdomain column to assemblies table
ALTER TABLE assemblies ADD COLUMN subdomain VARCHAR(100) UNIQUE;

-- Option B: Create separate tenants table
CREATE TABLE tenants (
  subdomain VARCHAR(100) PRIMARY KEY,
  assembly_id UUID NOT NULL REFERENCES assemblies(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

Then add the database function:

```clojure
;; In src/vgs/db/core.clj
(defn get-assembly-id-by-subdomain [subdomain]
  (when subdomain
    (-> (sql/select :assembly-id)
        (sql/from :tenants)
        (sql/where [:= :subdomain subdomain])
        (sql/limit 1)
        jdbc/execute-one!
        :assembly-id)))
```

---

## Example Request Flow

### User visits: `http://demo.localhost:3006/api/auth/login/web`

**Request:**
```http
POST /api/auth/login/web HTTP/1.1
Host: demo.localhost:3006
Content-Type: application/json

{
  "email": "admin@demo.com",
  "password": "password123"
}
```

**Backend processing:**
1. Extract subdomain from `Host` header: `"demo"`
2. Query database: `SELECT assembly_id FROM tenants WHERE subdomain = 'demo'`
3. Get result: `assembly-id = "abc123-def456-..."`
4. Authenticate user against that assembly
5. Return tokens + user object

**Response:**
```json
{
  "access-token": "eyJhbGc...",
  "refresh-token": "eyJhbGc...",
  "user": {
    "id": "user-uuid",
    "name": "Admin User",
    "email": "admin@demo.com",
    "assembly-id": "abc123-def456-...",
    "role": "admin"
  }
}
```

---

## Benefits

✅ **Better UX**: Users only need email/password
✅ **More Secure**: Assembly ID not exposed to users
✅ **True Multi-tenancy**: Subdomain determines everything
✅ **Cleaner Code**: No hardcoded/placeholder UUIDs
✅ **Flexible**: Still supports assembly-id if provided (for API clients, testing, etc.)

---

## Backward Compatibility

Making it optional means:
- ✅ Old clients can still send `assembly-id` in body (works as before)
- ✅ New clients can omit it (backend determines from subdomain)
- ✅ No breaking changes for existing integrations

---

## Testing

After implementing:

```bash
# Test 1: Without assembly-id (new behavior)
curl -X POST http://demo.localhost:3006/api/auth/login/web \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password123"}'

# Should return tokens + user with correct assembly-id

# Test 2: With assembly-id (old behavior - still works)
curl -X POST http://demo.localhost:3006/api/auth/login/web \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password123","assembly-id":"abc-123"}'

# Should still work as before
```

---

## Priority

**HIGH** - Frontend is ready and waiting. This is the last blocker for authentication.

---

## Questions?

Let me know if you need:
- Help with the subdomain extraction logic
- Sample SQL queries for the tenant lookup
- Clarification on any part of this

**Frontend is updated and ready to test as soon as this backend change is deployed!** 🚀
