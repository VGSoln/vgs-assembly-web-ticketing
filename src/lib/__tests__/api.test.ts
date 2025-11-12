/**
 * API Client Tests
 *
 * Comprehensive test suite for the VGS Assembly API client.
 * Tests cover:
 * - Successful API calls
 * - Error handling (network errors, HTTP errors)
 * - Authentication token handling
 * - 401 unauthorized redirects
 * - Query parameter construction
 */

import {
  APIError,
  healthCheck,
  getAssemblies,
  getAssembly,
  getTransactions,
  getLocations,
  getTicketTypes,
  getCustomerTypes,
  authenticate,
  getRevenueReport,
} from '../api';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('APIError', () => {
  it('should create an APIError with message, status, and data', () => {
    const error = new APIError('Test error', 404, { detail: 'Not found' });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('APIError');
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(404);
    expect(error.data).toEqual({ detail: 'Not found' });
  });

  it('should create an APIError without status and data', () => {
    const error = new APIError('Network error');

    expect(error.message).toBe('Network error');
    expect(error.status).toBeUndefined();
    expect(error.data).toBeUndefined();
  });
});

describe('API Client - fetchAPI wrapper', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Clear localStorage
    localStorage.clear();

    // Reset location href
    mockLocation.href = '';

    // Set default environment variable
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('Successful requests', () => {
    it('should make a successful GET request', async () => {
      const mockData = { status: 'ok', timestamp: '2025-01-01T00:00:00Z' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await healthCheck();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/health',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should include auth token in request headers when available', async () => {
      const mockToken = 'test-token-123';
      localStorage.setItem('auth_token', mockToken);

      const mockData = { data: [] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getAssemblies();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/assemblies',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should not include auth token when not available', async () => {
      const mockData = { data: [] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getAssemblies();

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('should throw APIError on HTTP error with error response', async () => {
      const errorResponse = { message: 'Invalid request' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => errorResponse,
      });

      await expect(healthCheck()).rejects.toThrow('Invalid request');
    });

    it('should throw APIError with status text when no error response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('No JSON');
        },
      });

      await expect(healthCheck()).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle 401 unauthorized by clearing auth and redirecting', async () => {
      localStorage.setItem('auth_token', 'expired-token');
      localStorage.setItem('auth_user', JSON.stringify({ id: '1', name: 'Test' }));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Token expired' }),
      });

      await expect(getAssemblies()).rejects.toThrow('Token expired');

      // Verify localStorage was cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();

      // Verify redirect happened
      expect(mockLocation.href).toBe('/login');
    });

    it('should throw APIError on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

      await expect(healthCheck()).rejects.toThrow('Network error: Network failure');
    });

    it('should handle unknown network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce('Unknown error');

      await expect(healthCheck()).rejects.toThrow('Network error: Unknown error');
    });
  });

  describe('POST requests', () => {
    it('should make POST request with body', async () => {
      const mockResponse = {
        token: 'new-token',
        user: { id: '1', name: 'Test User' },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authenticate('test@example.com', 'password123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('healthCheck', () => {
    it('should call /api/health endpoint', async () => {
      const mockData = { status: 'ok', timestamp: '2025-01-01T00:00:00Z' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await healthCheck();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/health',
        expect.any(Object)
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getAssemblies', () => {
    it('should call /api/assemblies endpoint', async () => {
      const mockData = [
        { id: '1', name: 'Assembly 1' },
        { id: '2', name: 'Assembly 2' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getAssemblies();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/assemblies',
        expect.any(Object)
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getAssembly', () => {
    it('should call /api/assemblies/:id endpoint', async () => {
      const mockData = { id: '123', name: 'Test Assembly' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getAssembly('123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/assemblies/123',
        expect.any(Object)
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getTransactions', () => {
    it('should call /api/transactions without query params', async () => {
      const mockData = [{ id: '1', amount: 100 }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getTransactions();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/transactions',
        expect.any(Object)
      );
    });

    it('should call /api/transactions with all query params', async () => {
      const mockData = [{ id: '1', amount: 100 }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getTransactions({
        assembly_id: 'asm-1',
        start_date: '2025-01-01',
        end_date: '2025-01-31',
        limit: 50,
        offset: 10,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/transactions?assembly_id=asm-1&start_date=2025-01-01&end_date=2025-01-31&limit=50&offset=10',
        expect.any(Object)
      );
    });

    it('should call /api/transactions with partial query params', async () => {
      const mockData = [{ id: '1', amount: 100 }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getTransactions({
        assembly_id: 'asm-1',
        limit: 20,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/transactions?assembly_id=asm-1&limit=20',
        expect.any(Object)
      );
    });
  });

  describe('getLocations', () => {
    it('should call /api/locations without assembly_id', async () => {
      const mockData = [{ id: '1', name: 'Location 1' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getLocations();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/locations',
        expect.any(Object)
      );
    });

    it('should call /api/locations with assembly_id', async () => {
      const mockData = [{ id: '1', name: 'Location 1' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getLocations('asm-123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/locations?assembly_id=asm-123',
        expect.any(Object)
      );
    });
  });

  describe('getTicketTypes', () => {
    it('should call /api/ticket-types without assembly_id', async () => {
      const mockData = [{ id: '1', type: 'Standard' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getTicketTypes();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/ticket-types',
        expect.any(Object)
      );
    });

    it('should call /api/ticket-types with assembly_id', async () => {
      const mockData = [{ id: '1', type: 'Standard' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getTicketTypes('asm-123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/ticket-types?assembly_id=asm-123',
        expect.any(Object)
      );
    });
  });

  describe('getCustomerTypes', () => {
    it('should call /api/customer-types without assembly_id', async () => {
      const mockData = [{ id: '1', type: 'Residential' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getCustomerTypes();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/customer-types',
        expect.any(Object)
      );
    });

    it('should call /api/customer-types with assembly_id', async () => {
      const mockData = [{ id: '1', type: 'Residential' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getCustomerTypes('asm-123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/customer-types?assembly_id=asm-123',
        expect.any(Object)
      );
    });
  });

  describe('authenticate', () => {
    it('should call /api/auth/login with credentials', async () => {
      const mockResponse = {
        token: 'jwt-token-123',
        user: { id: '1', name: 'Test User', role: 'admin' },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authenticate('admin@example.com', 'secure-password');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'admin@example.com',
            password: 'secure-password',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getRevenueReport', () => {
    it('should call /api/reports/revenue with all required params', async () => {
      const mockData = {
        total_revenue: 50000,
        transactions: 150,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getRevenueReport({
        assembly_id: 'asm-1',
        start_date: '2025-01-01',
        end_date: '2025-01-31',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/reports/revenue?assembly_id=asm-1&start_date=2025-01-01&end_date=2025-01-31',
        expect.any(Object)
      );
      expect(result).toEqual(mockData);
    });
  });
});

describe('API Base URL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should use configured API base URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });

    await healthCheck();

    // Should call the health endpoint with the configured base URL
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/health'),
      expect.any(Object)
    );
  });

  it('should construct full URL with base URL and endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });

    await healthCheck();

    const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(callUrl).toMatch(/^https?:\/\/.*\/api\/health$/);
  });
});
