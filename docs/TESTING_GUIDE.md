# Testing Guide for VGS Assembly Web Ticketing System

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Running Tests](#running-tests)
4. [Writing Tests](#writing-tests)
5. [Testing Patterns](#testing-patterns)
6. [Best Practices](#best-practices)
7. [Coverage Requirements](#coverage-requirements)
8. [CI/CD Integration](#cicd-integration)
9. [Common Pitfalls](#common-pitfalls)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

This project uses **Jest** and **React Testing Library** for testing. Our testing philosophy emphasizes:

- **User-centric testing**: Test how users interact with the application
- **Integration over unit**: Prefer integration tests that test multiple components together
- **Maintainability**: Write clear, readable tests that serve as documentation
- **Coverage goals**: Aim for >80% coverage on critical paths

### Testing Stack

- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing utilities
- **@testing-library/user-event**: Advanced user interaction simulation
- **jest-environment-jsdom**: Browser-like environment for tests

---

## Getting Started

### Prerequisites

All testing dependencies are already installed in `package.json`. If you need to reinstall:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### Configuration Files

- **jest.config.js**: Main Jest configuration
- **jest.setup.js**: Test environment setup (imports `@testing-library/jest-dom`)

---

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- src/lib/__tests__/api.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="login"

# Run tests for changed files only (in git)
npm test -- --onlyChanged
```

### Watch Mode Commands

When in watch mode, press:
- `a` - Run all tests
- `f` - Run only failed tests
- `p` - Filter by filename pattern
- `t` - Filter by test name pattern
- `q` - Quit watch mode

### Coverage Reports

After running `npm run test:coverage`, open:
```bash
open coverage/lcov-report/index.html
```

This shows an interactive HTML report with:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

---

## Writing Tests

### File Naming Conventions

Tests should be placed in `__tests__` directories:

```
src/
├── lib/
│   ├── api.ts
│   └── __tests__/
│       └── api.test.ts
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── __tests__/
│           └── Button.test.tsx
└── contexts/
    ├── AuthContext.tsx
    └── __tests__/
        └── AuthContext.test.tsx
```

Alternatively, use the `.test.ts` or `.spec.ts` suffix next to the file being tested.

### Test Structure

Use the **Arrange-Act-Assert** pattern:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Click handling', () => {
    it('should call onClick when clicked', () => {
      // Arrange: Set up test data and mocks
      const handleClick = jest.fn();

      // Act: Render component and perform action
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Assert: Verify expected outcome
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Basic Component Test Template

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);

    // Use screen.getByRole, getByText, getByLabelText, etc.
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Testing Components with Props

```typescript
it('should render with different variants', () => {
  const { rerender } = render(<Button variant="primary">Primary</Button>);
  expect(screen.getByRole('button')).toHaveClass('bg-blue-500');

  rerender(<Button variant="secondary">Secondary</Button>);
  expect(screen.getByRole('button')).toHaveClass('bg-gray-500');
});
```

### Testing User Interactions

```typescript
import { fireEvent, waitFor } from '@testing-library/react';

it('should handle form submission', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  // Type into inputs
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' },
  });

  // Click button
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for async operation
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });
});
```

---

## Testing Patterns

### 1. Mocking Fetch API

```typescript
// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

it('should fetch data successfully', async () => {
  const mockData = { id: 1, name: 'Test' };

  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => mockData,
  });

  const result = await fetchData();

  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:3000/api/data',
    expect.any(Object)
  );
  expect(result).toEqual(mockData);
});
```

### 2. Mocking localStorage

```typescript
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
});

it('should store token in localStorage', () => {
  localStorage.setItem('auth_token', 'test-token');

  expect(localStorage.getItem('auth_token')).toBe('test-token');
});

it('should handle missing localStorage data', () => {
  expect(localStorage.getItem('nonexistent')).toBeNull();
});
```

### 3. Testing Context Providers

```typescript
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

const TestComponent = () => {
  const { isAuthenticated } = useAuth();
  return <div>{isAuthenticated ? 'Logged in' : 'Logged out'}</div>;
};

it('should provide auth context', () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  expect(screen.getByText('Logged out')).toBeInTheDocument();
});
```

### 4. Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react';

it('should load data asynchronously', async () => {
  render(<DataComponent />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});
```

### 5. Testing Error States

```typescript
it('should display error message on failure', async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(
    new Error('Network error')
  );

  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### 6. Mocking External Dependencies

```typescript
// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="close-icon">X</div>,
  Check: () => <div data-testid="check-icon">✓</div>,
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));
```

### 7. Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

it('should toggle value', () => {
  const { result } = renderHook(() => useToggle(false));

  expect(result.current.value).toBe(false);

  act(() => {
    result.current.toggle();
  });

  expect(result.current.value).toBe(true);
});
```

---

## Best Practices

### 1. Query Priority

Use queries in this order (from most to least preferred):

1. **getByRole**: Most accessible
   ```typescript
   screen.getByRole('button', { name: /submit/i })
   ```

2. **getByLabelText**: For form inputs
   ```typescript
   screen.getByLabelText('Email address')
   ```

3. **getByPlaceholderText**: For inputs without labels
   ```typescript
   screen.getByPlaceholderText('Enter email')
   ```

4. **getByText**: For non-interactive elements
   ```typescript
   screen.getByText('Welcome back')
   ```

5. **getByTestId**: Last resort
   ```typescript
   screen.getByTestId('custom-element')
   ```

### 2. Assertions

Prefer specific assertions:

```typescript
// Good
expect(button).toBeInTheDocument();
expect(button).toHaveClass('bg-blue-500');
expect(button).toBeDisabled();

// Avoid generic assertions
expect(button).toBeTruthy();
```

### 3. Avoid Implementation Details

```typescript
// Bad: Testing implementation
expect(component.state.isOpen).toBe(true);

// Good: Testing behavior
expect(screen.getByRole('dialog')).toBeInTheDocument();
```

### 4. Use `waitFor` for Async

```typescript
// Always use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 5. Clean Up After Each Test

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### 6. Group Related Tests

```typescript
describe('Button Component', () => {
  describe('Variants', () => {
    it('should render primary variant', () => {});
    it('should render secondary variant', () => {});
  });

  describe('Click handling', () => {
    it('should call onClick', () => {});
    it('should not call onClick when disabled', () => {});
  });
});
```

### 7. Test Edge Cases

```typescript
describe('Edge cases', () => {
  it('should handle empty data', () => {});
  it('should handle invalid input', () => {});
  it('should handle network errors', () => {});
  it('should handle missing props', () => {});
});
```

### 8. Use Descriptive Test Names

```typescript
// Good: Clear, specific test names
it('should display error message when login fails with invalid credentials', () => {});

// Bad: Vague test names
it('should work', () => {});
it('test login', () => {});
```

---

## Coverage Requirements

### Global Thresholds

Set in `jest.config.js`:

```javascript
coverageThresholds: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
```

### Per-File Recommendations

- **Critical paths** (API, Auth): >90% coverage
- **UI Components**: >80% coverage
- **Page Components**: >70% coverage
- **Utilities**: >85% coverage

### What to Cover

**Must test:**
- Happy path (normal flow)
- Error cases (API failures, validation errors)
- Edge cases (empty data, null values, extremes)
- User interactions (clicks, typing, form submission)
- Conditional rendering (different UI states)

**Don't need to test:**
- Third-party libraries
- Type definitions
- Constant values
- Simple getters/setters

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage --watchAll=false

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

### Pre-commit Hook

Install Husky for pre-commit testing:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm test -- --watchAll=false --passWithNoTests"
```

### NPM Scripts for CI

```json
{
  "scripts": {
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:changed": "jest --onlyChanged --passWithNoTests"
  }
}
```

---

## Common Pitfalls

### 1. Not Waiting for Async Updates

```typescript
// Wrong: Missing await
it('should load data', () => {
  render(<AsyncComponent />);
  expect(screen.getByText('Loaded')).toBeInTheDocument(); // Fails!
});

// Correct: Use waitFor
it('should load data', async () => {
  render(<AsyncComponent />);
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### 2. Forgetting to Clear Mocks

```typescript
// Wrong: Mocks persist between tests
describe('Tests', () => {
  it('test 1', () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
  });

  it('test 2', () => {
    // Still using mock from test 1!
  });
});

// Correct: Clear mocks
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 3. Testing Implementation Instead of Behavior

```typescript
// Wrong: Testing internal state
expect(component.state.count).toBe(5);

// Correct: Testing user-visible behavior
expect(screen.getByText('Count: 5')).toBeInTheDocument();
```

### 4. Not Cleaning Up localStorage

```typescript
// Always clear localStorage between tests
beforeEach(() => {
  localStorage.clear();
});
```

### 5. Incorrect Query Usage

```typescript
// Wrong: Using getBy when element might not exist
expect(screen.getByText('Optional')).not.toBeInTheDocument(); // Throws error!

// Correct: Use queryBy for optional elements
expect(screen.queryByText('Optional')).not.toBeInTheDocument();
```

### 6. Not Mocking window.location

```typescript
// Wrong: Direct assignment fails in tests
window.location.href = '/login'; // Error in Jest!

// Correct: Mock window.location
const mockLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});
```

### 7. Snapshot Testing Overuse

```typescript
// Avoid: Brittle, hard to maintain
expect(component).toMatchSnapshot();

// Prefer: Specific, meaningful assertions
expect(screen.getByRole('button')).toHaveClass('primary');
```

---

## Troubleshooting

### Common Errors and Solutions

#### Error: "Cannot find module 'next/jest'"

**Solution**: Ensure Next.js is installed:
```bash
npm install next
```

#### Error: "ReferenceError: fetch is not defined"

**Solution**: Mock fetch in test:
```typescript
global.fetch = jest.fn();
```

#### Error: "localStorage is not defined"

**Solution**: Jest setup includes localStorage, but if issues persist:
```typescript
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});
```

#### Error: "Cannot read property 'pathname' of undefined"

**Solution**: Mock Next.js router:
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));
```

#### Error: Tests pass locally but fail in CI

**Solution**: Ensure consistent Node version and use `npm ci` instead of `npm install`

#### Error: "Warning: An update to Component inside a test was not wrapped in act(...)"

**Solution**: Wrap state updates in `act`:
```typescript
import { act } from '@testing-library/react';

await act(async () => {
  button.click();
});
```

### Debugging Tests

```typescript
// Print current DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Use logRoles to see available roles
import { logRoles } from '@testing-library/react';
const { container } = render(<Component />);
logRoles(container);
```

### Running Single Test

```bash
# Run only one test file
npm test -- Button.test.tsx

# Run only tests with specific name
npm test -- -t "should render correctly"

# Run in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Quick Reference

### Most Used Commands

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm test -- Button.test    # Specific file
npm test -- -t "login"     # Specific test
```

### Most Used Queries

```typescript
screen.getByRole('button')              // Best: Accessible
screen.getByLabelText('Email')          // Forms
screen.getByText('Hello')               // Text content
screen.getByPlaceholderText('Search')   // Input placeholder
screen.getByTestId('custom-id')         // Last resort
```

### Most Used Assertions

```typescript
expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('text')
expect(element).toHaveClass('className')
expect(element).toBeDisabled()
expect(element).toBeVisible()
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(args)
expect(fn).toHaveBeenCalledTimes(n)
```

---

**Happy Testing!** 🧪

For questions or issues, refer to the [test files in `src/__tests__`](./src/) for practical examples.
