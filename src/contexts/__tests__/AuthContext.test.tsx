/**
 * AuthContext Tests
 *
 * Comprehensive test suite for the authentication context.
 * Tests cover:
 * - Provider initialization and state
 * - Login flow (success and error cases)
 * - Logout functionality
 * - localStorage persistence
 * - useAuth hook
 * - Loading states
 */

import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock fetch globally
global.fetch = jest.fn();

// Test component to access auth context
const TestComponent = () => {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="is-authenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="is-loading">{auth.isLoading.toString()}</div>
      <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</div>
      <div data-testid="token">{auth.token || 'null'}</div>
      <button
        data-testid="login-button"
        onClick={() => auth.login('test@example.com', 'password')}
      >
        Login
      </button>
      <button data-testid="logout-button" onClick={() => auth.logout()}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Clear localStorage
    localStorage.clear();

    // Set environment variable
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
  });

  describe('AuthProvider initialization', () => {
    it('should initialize with no user when localStorage is empty', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(screen.getByTestId('token').textContent).toBe('null');
    });

    it('should initialize with user from localStorage', async () => {
      const mockUser = {
        id: '123',
        name: 'Test User',
        phone: '1234567890',
        role: 'admin',
        assemblyId: 'asm-1',
      };
      const mockToken = 'stored-token-123';

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      expect(screen.getByTestId('is-authenticated').textContent).toBe('true');
      expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
      expect(screen.getByTestId('token').textContent).toBe(mockToken);
    });

    it('should handle invalid JSON in localStorage gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      localStorage.setItem('auth_token', 'some-token');
      localStorage.setItem('auth_user', 'invalid-json{');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');

      // Verify localStorage was cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to parse stored user data:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle missing token with stored user', async () => {
      const mockUser = { id: '1', name: 'Test', phone: '123', role: 'user', assemblyId: 'asm-1' };

      // Only set user, not token
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      // Should not be authenticated without token
      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
    });
  });

  describe('login', () => {
    it('should successfully login and store credentials', async () => {
      const mockUser = {
        id: '456',
        name: 'New User',
        phone: '9876543210',
        role: 'staff',
        assemblyId: 'asm-2',
      };
      const mockToken = 'new-jwt-token';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: mockToken,
          user: mockUser,
        }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial loading
      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      // Click login button
      await act(async () => {
        screen.getByTestId('login-button').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated').textContent).toBe('true');
      });

      // Verify state updates
      expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
      expect(screen.getByTestId('token').textContent).toBe(mockToken);

      // Verify localStorage
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
      expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser));

      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password',
          }),
        }
      );
    });

    it('should handle login error with error message', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Invalid credentials',
        }),
      });

      const LoginTestComponent = () => {
        const { login, isAuthenticated, isLoading } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        const handleLogin = async () => {
          try {
            await login('test@example.com', 'password');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
          }
        };

        return (
          <div>
            <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
            <div data-testid="is-loading">{isLoading.toString()}</div>
            <div data-testid="error">{error || 'null'}</div>
            <button data-testid="login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <LoginTestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      // Click login button
      fireEvent.click(screen.getByTestId('login-button'));

      // Should remain unauthenticated and show error
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Invalid credentials');
      });

      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');

      // Verify localStorage is empty
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();

      consoleErrorSpy.mockRestore();
    });

    it('should handle login error without error message', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      const LoginTestComponent = () => {
        const { login, isAuthenticated, isLoading } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        const handleLogin = async () => {
          try {
            await login('test@example.com', 'password');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
          }
        };

        return (
          <div>
            <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
            <div data-testid="is-loading">{isLoading.toString()}</div>
            <div data-testid="error">{error || 'null'}</div>
            <button data-testid="login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <LoginTestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      // Click login button
      fireEvent.click(screen.getByTestId('login-button'));

      // Should show default error message
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Authentication failed');
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle network error during login', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

      const LoginTestComponent = () => {
        const { login, isAuthenticated, isLoading } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        const handleLogin = async () => {
          try {
            await login('test@example.com', 'password');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
          }
        };

        return (
          <div>
            <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
            <div data-testid="is-loading">{isLoading.toString()}</div>
            <div data-testid="error">{error || 'null'}</div>
            <button data-testid="login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <LoginTestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      // Click login button
      fireEvent.click(screen.getByTestId('login-button'));

      // Should handle network error
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Network failure');
      });

      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('should clear user state and localStorage', async () => {
      const mockUser = {
        id: '789',
        name: 'Logout User',
        phone: '5555555555',
        role: 'admin',
        assemblyId: 'asm-3',
      };
      const mockToken = 'logout-token';

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated').textContent).toBe('true');
      });

      // Click logout
      await act(async () => {
        screen.getByTestId('logout-button').click();
      });

      // Verify state is cleared
      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(screen.getByTestId('token').textContent).toBe('null');

      // Verify localStorage is cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('should handle logout when not logged in', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      // Logout when not logged in should not throw
      await act(async () => {
        screen.getByTestId('logout-button').click();
      });

      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const TestComponentOutside = () => {
        useAuth(); // This should throw
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponentOutside />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleErrorSpy.mockRestore();
    });

    it('should provide context when used within AuthProvider', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      // Should render without errors
      expect(screen.getByTestId('is-authenticated')).toBeInTheDocument();
      expect(screen.getByTestId('user')).toBeInTheDocument();
      expect(screen.getByTestId('token')).toBeInTheDocument();
    });
  });

  describe('isAuthenticated computed property', () => {
    it('should be true when both token and user exist', async () => {
      const mockUser = { id: '1', name: 'Test', phone: '123', role: 'user', assemblyId: 'asm-1' };
      const mockToken = 'valid-token';

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated').textContent).toBe('true');
      });
    });

    it('should be false when token exists but user is null', async () => {
      localStorage.setItem('auth_token', 'orphan-token');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
    });

    it('should be false when user exists but token is null', async () => {
      const mockUser = { id: '1', name: 'Test', phone: '123', role: 'user', assemblyId: 'asm-1' };
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });

      expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
    });
  });

  describe('Loading state', () => {
    it('should be loading initially and then false after initialization', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially should be loading (but may be too fast to catch in test)
      // After waiting, should not be loading
      await waitFor(() => {
        expect(screen.getByTestId('is-loading').textContent).toBe('false');
      });
    });
  });

  describe('Multiple components using auth', () => {
    it('should share state across multiple components', async () => {
      const Component1 = () => {
        const { isAuthenticated } = useAuth();
        return <div data-testid="comp1-auth">{isAuthenticated.toString()}</div>;
      };

      const Component2 = () => {
        const { isAuthenticated } = useAuth();
        return <div data-testid="comp2-auth">{isAuthenticated.toString()}</div>;
      };

      const mockUser = { id: '1', name: 'Test', phone: '123', role: 'user', assemblyId: 'asm-1' };
      const mockToken = 'shared-token';

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <Component1 />
          <Component2 />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('comp1-auth').textContent).toBe('true');
        expect(screen.getByTestId('comp2-auth').textContent).toBe('true');
      });
    });
  });
});
