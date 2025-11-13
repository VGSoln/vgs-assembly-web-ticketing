/**
 * API client for VGS Assembly Backend
 * Multi-tenant backend with subdomain-based routing
 * Auto-detects subdomain from browser URL (e.g., demo.localhost:3004 -> demo.localhost:3000)
 */

/**
 * Get API base URL with auto-detected subdomain
 */
function getAPIBaseURL(): string {
  if (typeof window === 'undefined') {
    // Server-side: use default
    return 'http://localhost:3000';
  }

  const protocol = process.env.NEXT_PUBLIC_API_PROTOCOL || 'http';
  const port = process.env.NEXT_PUBLIC_API_PORT || '3000';
  const hostname = window.location.hostname;

  // Construct API URL using the same subdomain as the current page
  return `${protocol}://${hostname}:${port}`;
}

const API_BASE_URL = getAPIBaseURL();

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get auth token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      // Handle 401 Unauthorized - clear auth and redirect to login
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }

      throw new APIError(
        errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * Health check endpoint
 */
export async function healthCheck() {
  return fetchAPI<{ status: string; timestamp: string }>('/api/health');
}

/**
 * Get all assemblies
 */
export async function getAssemblies() {
  return fetchAPI<any[]>('/api/assemblies');
}

/**
 * Get assembly by ID
 */
export async function getAssembly(id: string) {
  return fetchAPI<any>(`/api/assemblies/${id}`);
}

/**
 * Get all transactions
 */
export async function getTransactions(params?: {
  'assembly-id'?: string;
  'start-date'?: string;
  'end-date'?: string;
  limit?: number;
  offset?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.['assembly-id']) queryParams.set('assembly-id', params['assembly-id']);
  if (params?.['start-date']) queryParams.set('start-date', params['start-date']);
  if (params?.['end-date']) queryParams.set('end-date', params['end-date']);
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());

  const query = queryParams.toString();
  return fetchAPI<any[]>(`/api/transactions${query ? `?${query}` : ''}`);
}

/**
 * Get all locations
 */
export async function getLocations(assemblyId?: string) {
  const query = assemblyId ? `?assembly-id=${assemblyId}` : '';
  return fetchAPI<any[]>(`/api/locations${query}`);
}

/**
 * Get all ticket types
 */
export async function getTicketTypes(assemblyId?: string) {
  const query = assemblyId ? `?assembly-id=${assemblyId}` : '';
  return fetchAPI<any[]>(`/api/ticket-types${query}`);
}

/**
 * Get all customer types
 */
export async function getCustomerTypes(assemblyId?: string) {
  const query = assemblyId ? `?assembly-id=${assemblyId}` : '';
  return fetchAPI<any[]>(`/api/customer-types${query}`);
}

/**
 * Authenticate user (Legacy - use loginWeb or loginMobile)
 */
export async function authenticate(
  email: string,
  password: string
) {
  return fetchAPI<{ token: string; user: any }>('/api/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

/**
 * Login for web app (email + password)
 * Note: assembly-id is optional - backend determines it from subdomain
 */
export async function loginWeb(email: string, password: string, assemblyId?: string) {
  const body: any = {
    email,
    password,
  };

  // Only include assembly-id if provided
  if (assemblyId) {
    body['assembly-id'] = assemblyId;
  }

  return fetchAPI<{
    'access-token': string;
    'refresh-token': string;
    user: any;
  }>('/api/auth/login/web', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Login for mobile app (phone + PIN)
 */
export async function loginMobile(phone: string, pin: string, assemblyId: string) {
  return fetchAPI<{
    'access-token': string;
    'refresh-token': string;
    user: any;
  }>('/api/auth/login/mobile', {
    method: 'POST',
    body: JSON.stringify({
      phone,
      pin,
      'assembly-id': assemblyId,
    }),
  });
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  return fetchAPI<any>('/api/auth/me');
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string) {
  return fetchAPI<{ 'access-token': string }>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({
      'refresh-token': refreshToken,
    }),
  });
}

/**
 * Logout (revoke refresh token)
 */
export async function logout(refreshToken: string) {
  return fetchAPI<{ message: string }>('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({
      'refresh-token': refreshToken,
    }),
  });
}

/**
 * Get revenue report
 */
export async function getRevenueReport(params: {
  'assembly-id': string;
  'start-date': string;
  'end-date': string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
    'start-date': params['start-date'],
    'end-date': params['end-date'],
  });

  return fetchAPI<any>(`/api/reports/revenue?${queryParams.toString()}`);
}

/**
 * Get outstanding deposits report
 */
export async function getOutstandingDeposits(params: {
  'assembly-id': string;
  'start-date'?: string;
  'end-date'?: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
  });
  if (params['start-date']) queryParams.set('start-date', params['start-date']);
  if (params['end-date']) queryParams.set('end-date', params['end-date']);

  return fetchAPI<any[]>(`/api/reports/outstanding-deposits?${queryParams.toString()}`);
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(params: {
  'assembly-id': string;
  'start-date'?: string;
  'end-date'?: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
  });
  if (params['start-date']) queryParams.set('start-date', params['start-date']);
  if (params['end-date']) queryParams.set('end-date', params['end-date']);

  return fetchAPI<any>(`/api/reports/dashboard-stats?${queryParams.toString()}`);
}

/**
 * Get revenue officer performance report
 */
export async function getOfficerPerformance(params: {
  'assembly-id': string;
  'start-date': string;
  'end-date': string;
  'user-id'?: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
    'start-date': params['start-date'],
    'end-date': params['end-date'],
  });
  if (params['user-id']) queryParams.set('user-id', params['user-id']);

  return fetchAPI<any[]>(`/api/reports/officer-performance?${queryParams.toString()}`);
}

/**
 * Get customer payment status report
 */
export async function getCustomerPaymentStatus(params: {
  'assembly-id': string;
  'start-date'?: string;
  'end-date'?: string;
  'location-id'?: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
  });
  if (params['start-date']) queryParams.set('start-date', params['start-date']);
  if (params['end-date']) queryParams.set('end-date', params['end-date']);
  if (params['location-id']) queryParams.set('location-id', params['location-id']);

  return fetchAPI<any>(`/api/reports/customer-payment-status?${queryParams.toString()}`);
}

/**
 * Get GPS transactions
 * Note: Route moved from /transactions/with-gps to /gps-transactions due to Reitit conflicts
 */
export async function getGPSTransactions(params: {
  'assembly-id': string;
  'user-id'?: string;
  'start-date'?: string;
  'end-date'?: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
  });
  if (params['user-id']) queryParams.set('user-id', params['user-id']);
  if (params['start-date']) queryParams.set('start-date', params['start-date']);
  if (params['end-date']) queryParams.set('end-date', params['end-date']);

  return fetchAPI<any[]>(`/api/gps-transactions?${queryParams.toString()}`);
}

/**
 * Get revenue officer field paths for a specific day
 */
export async function getOfficerPaths(params: {
  'assembly-id': string;
  'user-id': string;
  date: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
    'user-id': params['user-id'],
    date: params.date,
  });

  return fetchAPI<any[]>(`/api/reports/officer-paths?${queryParams.toString()}`);
}

// ============================================================================
// Users Management
// ============================================================================

/**
 * Get all users
 */
export async function getUsers(params: {
  'assembly-id': string;
  role?: string;
  'active-only'?: boolean;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
  });
  if (params.role) queryParams.set('role', params.role);
  if (params['active-only']) queryParams.set('active-only', 'true');

  return fetchAPI<any[]>(`/api/users?${queryParams.toString()}`);
}

/**
 * Get user by ID
 */
export async function getUser(id: string) {
  return fetchAPI<any>(`/api/users/${id}`);
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  'assembly-id': string;
  'first-name': string;
  'last-name': string;
  phone: string;
  pin: string;
  role: 'officer' | 'supervisor' | 'admin';
  'zone-id'?: string;
  email?: string;
  password?: string;
}) {
  return fetchAPI<any>('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Update user
 */
export async function updateUser(id: string, data: {
  'first-name'?: string;
  'last-name'?: string;
  phone?: string;
  email?: string;
  role?: 'officer' | 'supervisor' | 'admin';
  'zone-id'?: string;
  pin?: string;
  password?: string;
}) {
  return fetchAPI<any>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deactivate a user
 */
export async function deactivateUser(userId: string) {
  return fetchAPI<{ message: string }>(`/api/users/${userId}/deactivate`, {
    method: 'POST',
  });
}

/**
 * Get user outstanding balance
 */
export async function getUserBalance(userId: string) {
  return fetchAPI<any>(`/api/users/${userId}/balance`);
}

// ============================================================================
// Zones Management
// ============================================================================

/**
 * Get all zones
 */
export async function getZones(params: {
  'assembly-id': string;
  'active-only'?: boolean;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
  });
  if (params['active-only']) queryParams.set('active-only', 'true');

  return fetchAPI<any[]>(`/api/zones?${queryParams.toString()}`);
}

/**
 * Get zone by ID
 */
export async function getZone(id: string) {
  return fetchAPI<any>(`/api/zones/${id}`);
}

/**
 * Create a new zone
 */
export async function createZone(zoneData: {
  'assembly-id': string;
  name: string;
  description?: string;
}) {
  return fetchAPI<any>('/api/zones', {
    method: 'POST',
    body: JSON.stringify(zoneData),
  });
}

/**
 * Update zone
 */
export async function updateZone(id: string, data: {
  name?: string;
  description?: string;
}) {
  return fetchAPI<any>(`/api/zones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deactivate zone
 */
export async function deactivateZone(id: string) {
  return fetchAPI<any>(`/api/zones/${id}/deactivate`, {
    method: 'POST',
  });
}

// ============================================================================
// Customers Management
// ============================================================================

/**
 * Get all customers
 */
export async function getCustomers(params: {
  'assembly-id': string;
  'location-id'?: string;
  'customer-type-id'?: string;
  'active-only'?: boolean;
  limit?: number;
  offset?: number;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
  });
  if (params['location-id']) queryParams.set('location-id', params['location-id']);
  if (params['customer-type-id']) queryParams.set('customer-type-id', params['customer-type-id']);
  if (params['active-only']) queryParams.set('active-only', 'true');
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.offset) queryParams.set('offset', params.offset.toString());

  return fetchAPI<any[]>(`/api/customers?${queryParams.toString()}`);
}

/**
 * Lookup customer by search criteria
 * Note: Route moved from /customers/lookup to /customer-search due to Reitit conflicts
 */
export async function lookupCustomer(params: {
  'assembly-id': string;
  query: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
    query: params.query,
  });

  return fetchAPI<any[]>(`/api/customer-search?${queryParams.toString()}`);
}

/**
 * Get customer by ID
 */
export async function getCustomer(id: string) {
  return fetchAPI<any>(`/api/customers/${id}`);
}

/**
 * Register a new customer
 */
export async function createCustomer(customerData: {
  'assembly-id': string;
  'location-id': string;
  'customer-type-id': string;
  phone: string;
  'alt-phone'?: string;
  identifier?: string;
  'gps-latitude'?: number;
  'gps-longitude'?: number;
}) {
  return fetchAPI<any>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });
}

/**
 * Update customer
 */
export async function updateCustomer(id: string, data: {
  'location-id'?: string;
  'customer-type-id'?: string;
  phone?: string;
  'alt-phone'?: string;
  identifier?: string;
  'gps-latitude'?: number;
  'gps-longitude'?: number;
}) {
  return fetchAPI<any>(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deactivate customer
 */
export async function deactivateCustomer(id: string) {
  return fetchAPI<any>(`/api/customers/${id}/deactivate`, {
    method: 'POST',
  });
}

/**
 * Reactivate customer
 */
export async function reactivateCustomer(id: string) {
  return fetchAPI<any>(`/api/customers/${id}/reactivate`, {
    method: 'POST',
  });
}

// ============================================================================
// Deposits Management
// ============================================================================

/**
 * Get all deposits
 */
export async function getDeposits(params: {
  'assembly-id': string;
  'user-id'?: string;
  'start-date'?: string;
  'end-date'?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
  });
  if (params['user-id']) queryParams.set('user-id', params['user-id']);
  if (params['start-date']) queryParams.set('start-date', params['start-date']);
  if (params['end-date']) queryParams.set('end-date', params['end-date']);
  if (params.status) queryParams.set('status', params.status);

  return fetchAPI<any[]>(`/api/deposits?${queryParams.toString()}`);
}

/**
 * Get deposit by ID
 */
export async function getDeposit(id: string) {
  return fetchAPI<any>(`/api/deposits/${id}`);
}

/**
 * Record a new deposit
 */
export async function createDeposit(depositData: {
  'assembly-id': string;
  'user-id': string;
  amount: number;
  'deposit-date': string;
  'bank-name'?: string;
  'reference-number'?: string;
  notes?: string;
}) {
  return fetchAPI<any>('/api/deposits', {
    method: 'POST',
    body: JSON.stringify(depositData),
  });
}

/**
 * Link transactions to a deposit
 */
export async function linkTransactionsToDeposit(depositId: string, transactionIds: string[]) {
  return fetchAPI<any>(`/api/deposits/${depositId}/link-transactions`, {
    method: 'POST',
    body: JSON.stringify({
      'transaction-ids': transactionIds,
    }),
  });
}

/**
 * Reconcile a deposit
 */
export async function reconcileDeposit(depositId: string) {
  return fetchAPI<any>(`/api/deposits/${depositId}/reconcile`, {
    method: 'POST',
  });
}

// ============================================================================
// Ticket Rates Management
// ============================================================================

/**
 * Create a new ticket rate
 */
export async function createTicketRate(rateData: {
  'assembly-id': string;
  'ticket-type-id': string;
  'customer-type-id': string;
  amount: number;
  'effective-date': string;
}) {
  return fetchAPI<any>('/api/ticket-rates', {
    method: 'POST',
    body: JSON.stringify(rateData),
  });
}

/**
 * Get active rate for ticket and customer type
 * Note: Route moved from /ticket-rates/active to /active-ticket-rate due to Reitit conflicts
 */
export async function getActiveTicketRate(params: {
  'assembly-id': string;
  'ticket-type-id': string;
  'customer-type-id': string;
  'as-of-date'?: string;
}) {
  const queryParams = new URLSearchParams({
    'assembly-id': params['assembly-id'],
    'ticket-type-id': params['ticket-type-id'],
    'customer-type-id': params['customer-type-id'],
  });
  if (params['as-of-date']) queryParams.set('as-of-date', params['as-of-date']);

  return fetchAPI<any>(`/api/active-ticket-rate?${queryParams.toString()}`);
}

/**
 * Get ticket rate by ID
 */
export async function getTicketRate(id: string) {
  return fetchAPI<any>(`/api/ticket-rates/${id}`);
}

/**
 * Update ticket rate
 */
export async function updateTicketRate(id: string, data: {
  amount?: number;
  'effective-date'?: string;
  'end-date'?: string;
}) {
  return fetchAPI<any>(`/api/ticket-rates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deactivate ticket rate
 */
export async function deactivateTicketRate(id: string) {
  return fetchAPI<any>(`/api/ticket-rates/${id}/deactivate`, {
    method: 'POST',
  });
}

// ============================================================================
// Transactions Management
// ============================================================================

/**
 * Get transaction by ID
 */
export async function getTransaction(id: string) {
  return fetchAPI<any>(`/api/transactions/${id}`);
}

/**
 * Create a new transaction
 */
export async function createTransaction(transactionData: {
  'assembly-id': string;
  'user-id': string;
  'customer-id': string;
  'ticket-type-id': string;
  amount: number;
  'payment-type': string;
  'transaction-date': string;
  'gps-latitude'?: number;
  'gps-longitude'?: number;
  'cheque-number'?: string;
  'receipt-photo-url'?: string;
}) {
  return fetchAPI<any>('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
}

/**
 * Void a transaction
 */
export async function voidTransaction(transactionId: string, reason: string) {
  return fetchAPI<any>(`/api/transactions/${transactionId}/void`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

// ============================================================================
// Sync Operations (Mobile)
// ============================================================================

/**
 * Process offline transactions from mobile app
 */
export async function syncOfflineTransactions(transactions: any[]) {
  return fetchAPI<any>('/api/sync/offline-transactions', {
    method: 'POST',
    body: JSON.stringify({ transactions }),
  });
}

/**
 * Mark transactions as synced
 */
export async function markTransactionsSynced(transactionIds: string[]) {
  return fetchAPI<any>('/api/sync/mark-synced', {
    method: 'POST',
    body: JSON.stringify({
      'transaction-ids': transactionIds,
    }),
  });
}

// ============================================================================
// Locations Management
// ============================================================================

/**
 * Get location by ID
 */
export async function getLocation(id: string) {
  return fetchAPI<any>(`/api/locations/${id}`);
}

/**
 * Create a new location
 */
export async function createLocation(locationData: {
  'assembly-id': string;
  name: string;
  'location-type': string;
  'zone-id'?: string;
  'gps-latitude'?: number;
  'gps-longitude'?: number;
}) {
  return fetchAPI<any>('/api/locations', {
    method: 'POST',
    body: JSON.stringify(locationData),
  });
}

/**
 * Update location
 */
export async function updateLocation(id: string, data: {
  name?: string;
  'location-type'?: string;
  'zone-id'?: string;
  'gps-latitude'?: number;
  'gps-longitude'?: number;
}) {
  return fetchAPI<any>(`/api/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deactivate location
 */
export async function deactivateLocation(id: string) {
  return fetchAPI<any>(`/api/locations/${id}/deactivate`, {
    method: 'POST',
  });
}

// ============================================================================
// Ticket Types Management
// ============================================================================

/**
 * Get ticket type by ID
 */
export async function getTicketType(id: string) {
  return fetchAPI<any>(`/api/ticket-types/${id}`);
}

/**
 * Create a new ticket type
 */
export async function createTicketType(ticketTypeData: {
  'assembly-id': string;
  name: string;
  description?: string;
}) {
  return fetchAPI<any>('/api/ticket-types', {
    method: 'POST',
    body: JSON.stringify(ticketTypeData),
  });
}

/**
 * Update ticket type
 */
export async function updateTicketType(id: string, data: {
  name?: string;
  description?: string;
}) {
  return fetchAPI<any>(`/api/ticket-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deactivate ticket type
 */
export async function deactivateTicketType(id: string) {
  return fetchAPI<any>(`/api/ticket-types/${id}/deactivate`, {
    method: 'POST',
  });
}

// ============================================================================
// Customer Types Management
// ============================================================================

/**
 * Get customer type by ID
 */
export async function getCustomerType(id: string) {
  return fetchAPI<any>(`/api/customer-types/${id}`);
}

/**
 * Create a new customer type
 */
export async function createCustomerType(customerTypeData: {
  'assembly-id': string;
  name: string;
  description?: string;
}) {
  return fetchAPI<any>('/api/customer-types', {
    method: 'POST',
    body: JSON.stringify(customerTypeData),
  });
}

/**
 * Update customer type
 */
export async function updateCustomerType(id: string, data: {
  name?: string;
  description?: string;
}) {
  return fetchAPI<any>(`/api/customer-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deactivate customer type
 */
export async function deactivateCustomerType(id: string) {
  return fetchAPI<any>(`/api/customer-types/${id}/deactivate`, {
    method: 'POST',
  });
}

// ============================================================================
// Export default API client
// ============================================================================

export const api = {
  // Health
  healthCheck,

  // Assemblies
  getAssemblies,
  getAssembly,

  // Auth
  authenticate,
  loginWeb,
  loginMobile,
  getCurrentUser,
  refreshToken,
  logout,

  // Users
  getUsers,
  getUser,
  createUser,
  updateUser,
  deactivateUser,
  getUserBalance,

  // Zones
  getZones,
  getZone,
  createZone,
  updateZone,
  deactivateZone,

  // Customers
  getCustomers,
  getCustomer,
  lookupCustomer,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
  reactivateCustomer,

  // Transactions
  getTransactions,
  getTransaction,
  createTransaction,
  voidTransaction,

  // Deposits
  getDeposits,
  getDeposit,
  createDeposit,
  linkTransactionsToDeposit,
  reconcileDeposit,

  // Locations
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deactivateLocation,

  // Ticket Types
  getTicketTypes,
  getTicketType,
  createTicketType,
  updateTicketType,
  deactivateTicketType,

  // Customer Types
  getCustomerTypes,
  getCustomerType,
  createCustomerType,
  updateCustomerType,
  deactivateCustomerType,

  // Ticket Rates
  createTicketRate,
  getTicketRate,
  getActiveTicketRate,
  updateTicketRate,
  deactivateTicketRate,

  // Reports
  getRevenueReport,
  getOutstandingDeposits,
  getDashboardStats,
  getOfficerPerformance,
  getCustomerPaymentStatus,
  getGPSTransactions,
  getOfficerPaths,

  // Sync
  syncOfflineTransactions,
  markTransactionsSynced,
};

export default api;
