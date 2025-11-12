# CI/CD Setup Guide

Complete guide for setting up continuous integration and deployment for the VGS Assembly Web Ticketing System.

## Overview

This project includes a comprehensive CI/CD pipeline that:
- ✅ Lints and formats code
- ✅ Runs security audits
- ✅ Executes tests with coverage reports
- ✅ Builds the application
- ✅ Prepares deployment packages
- ✅ Sends WhatsApp notifications
- ✅ Monitors for user responses

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs all development dependencies including:
- Jest & React Testing Library (testing)
- Prettier (code formatting)
- ESLint (linting)
- TypeScript compiler

### 2. Run Tests Locally

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### 3. Format Code

```bash
# Format all files
npm run format

# Check formatting (without changing files)
npm run format:check
```

### 4. Lint Code

```bash
# Run ESLint
npm run lint

# Check TypeScript compilation
npx tsc --noEmit
```

### 5. Build Application

```bash
# Create production build
npm run build

# Run production build locally
npm start
```

## GitHub Actions Setup

### Prerequisites

1. **GitHub Repository**
   - Push your code to GitHub
   - Enable Actions in repository settings

2. **Required Secrets**

   Go to Settings → Secrets and variables → Actions, then add:

   | Secret Name | Description | Required |
   |-------------|-------------|----------|
   | `NEXT_PUBLIC_API_URL` | Backend API URL (e.g., https://api.yourdomain.com) | Yes |
   | `CODECOV_TOKEN` | Codecov token for coverage reports | Optional |
   | `SNYK_TOKEN` | Snyk token for security scanning | Optional |

### Workflow Files

Two workflows are configured:

#### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger via GitHub Actions UI

**Jobs:**
- **Lint** - ESLint and TypeScript checks
- **Format** - Prettier format verification
- **Security** - npm audit, Snyk scan, secret detection
- **Test** - Jest tests with coverage
- **Build** - Next.js production build
- **Prepare Deployment** - Package for AWS deployment

#### 2. WhatsApp Notifications (`.github/workflows/whatsapp-notify.yml`)

**Triggers:**
- After CI/CD pipeline completes
- Manual trigger with custom messages

**Jobs:**
- **Notify WhatsApp** - Send status to Demo group
- **Check Response** - Monitor for user responses (optional)

### Enabling Workflows

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```

2. **Check Actions Tab:**
   - Go to your repository on GitHub
   - Click "Actions" tab
   - You should see the workflow running

3. **View Results:**
   - Click on a workflow run
   - See detailed logs for each job
   - Download artifacts (build, coverage reports)

## Local Development Workflow

### Pre-Commit Checks

Before committing, run:

```bash
# Quick check (fast)
npm run lint && npm run format:check

# Full check (includes tests)
npm run lint && npm test && npm run build
```

### Recommended Git Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Format check
echo "📝 Checking code formatting..."
npm run format:check
if [ $? -ne 0 ]; then
    echo "❌ Format check failed. Run: npm run format"
    exit 1
fi

# Lint
echo "🔍 Linting code..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Lint failed. Fix errors and try again."
    exit 1
fi

# TypeScript check
echo "📘 Checking TypeScript..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found."
    exit 1
fi

# Tests (quick run)
echo "🧪 Running tests..."
npm test -- --bail --findRelatedTests
if [ $? -ne 0 ]; then
    echo "❌ Tests failed."
    exit 1
fi

echo "✅ All pre-commit checks passed!"
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Testing Strategy

### Test Coverage Requirements

Current thresholds (in `jest.config.js`):

```javascript
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
```

### Test Organization

```
src/
├── lib/
│   └── __tests__/
│       └── api.test.ts          # API client tests
├── contexts/
│   └── __tests__/
│       └── AuthContext.test.tsx # Auth context tests
└── components/
    └── ui/
        └── __tests__/
            ├── Button.test.tsx  # UI component tests
            └── Modal.test.tsx
```

### Writing New Tests

See `TESTING_GUIDE.md` for comprehensive testing documentation.

Quick template:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Security Scanning

### npm audit

Automatically runs on every push:

```bash
# Run locally
npm audit

# Fix automatically (use with caution)
npm audit fix
```

### Snyk (Optional)

For advanced security scanning:

1. Sign up at [snyk.io](https://snyk.io)
2. Get your token
3. Add as `SNYK_TOKEN` secret in GitHub
4. Pipeline will automatically scan

### Secret Detection

TruffleHog scans for exposed secrets:
- API keys
- Tokens
- Passwords
- Private keys

**Best Practice:** Never commit `.env` files or secrets.

## Code Quality Tools

### ESLint

Configuration: `.eslintrc.json`

Rules enforced:
- Next.js best practices
- React hooks rules
- TypeScript strict checks
- Import ordering

### Prettier

Configuration: `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### TypeScript

Configuration: `tsconfig.json`

Strict mode enabled:
- No implicit any
- Strict null checks
- No unused locals/parameters

## Build Artifacts

### What Gets Created

After successful build:

1. **Production Build**
   - `.next/` directory
   - Optimized JavaScript bundles
   - Static assets

2. **Coverage Report**
   - `coverage/` directory
   - HTML report
   - LCOV format

3. **Deployment Package**
   - `deployment-package.tar.gz`
   - Includes build + dependencies
   - Ready for AWS deployment

### Downloading Artifacts

From GitHub Actions:

1. Go to Actions → Workflow Run
2. Scroll to "Artifacts" section
3. Download:
   - `production-build`
   - `coverage-report`
   - `deployment-package`

## WhatsApp Integration

### Setup

The WhatsApp integration uses Claude Code's built-in slash commands:
- `/wasend` - Send messages
- `/waread` - Read messages
- `/wafind` - Find contacts/groups

No additional setup required if slash commands are available.

### Sending Notifications

**From CI/CD (Automatic):**
- Triggers after pipeline completion
- Sends status to "Demo" group

**Manual Trigger:**
1. Go to Actions → WhatsApp Notifications
2. Click "Run workflow"
3. Enter custom message
4. Check "Wait for response" if needed
5. Run

**From Command Line:**
```bash
# Send custom message
./.github/scripts/local-whatsapp-notify.sh "Your message"

# Send build status
./.github/scripts/local-whatsapp-notify.sh --build-status success

# Check for responses
./.github/scripts/local-whatsapp-notify.sh --check-response
```

See `WHATSAPP_INTEGRATION.md` for complete documentation.

## Deployment

### Build Package

The CI/CD pipeline creates a deployment-ready package:

```bash
deployment-package.tar.gz
├── .next/              # Built application
├── public/             # Static assets
├── package.json        # Dependencies
├── package-lock.json   # Lock file
└── build-info.json     # Build metadata
```

### Deploy to AWS

See `AWS_DEPLOYMENT_OPTIONS.md` for detailed deployment guides.

**Quick Options:**

1. **AWS App Runner** (Recommended)
   - Upload Docker image
   - Auto-scaling
   - $25-35/month

2. **AWS Amplify**
   - Connect GitHub repo
   - Auto-deploy on push
   - $15-25/month

3. **AWS ECS Fargate**
   - Container-based
   - Full control
   - $100+/month

### Environment Variables

Set these in your deployment platform:

```bash
# Required
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Optional
NODE_ENV=production
PORT=3001
```

## Monitoring

### GitHub Actions

Monitor pipeline health:
- Actions tab → View runs
- Check success rate
- Review duration trends

### Coverage Trends

Track coverage over time:
- Upload to Codecov (optional)
- View reports in artifacts
- Set coverage goals

### Build Performance

Monitor build times:
- GitHub Actions summary
- Look for slowdowns
- Optimize if needed

## Troubleshooting

### Tests Failing

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- path/to/test.test.ts

# Clear Jest cache
npm test -- --clearCache
```

### Build Failing

```bash
# Check TypeScript errors
npx tsc --noEmit

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Lint/Format Issues

```bash
# Auto-fix ESLint issues
npm run lint -- --fix

# Auto-format all files
npm run format
```

### WhatsApp Not Sending

```bash
# Test locally
./.github/scripts/local-whatsapp-notify.sh --find

# Check logs
cat .wa-notifications.log

# Verify slash commands available
# Run in Claude Code terminal
```

## Best Practices

### 1. Commit Often
- Small, focused commits
- Run tests before pushing
- Use descriptive commit messages

### 2. Review Coverage
- Check coverage reports
- Aim for >80% on critical files
- Write tests for bug fixes

### 3. Monitor Pipeline
- Fix failures quickly
- Don't ignore warnings
- Keep dependencies updated

### 4. Use Branches
- `main` - production-ready
- `develop` - integration branch
- `feature/*` - new features
- `bugfix/*` - bug fixes

### 5. Document Changes
- Update CHANGELOG
- Add comments to complex code
- Keep README current

## Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Run production build

# Testing
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code
npm run format:check    # Check formatting

# WhatsApp (local)
./.github/scripts/local-whatsapp-notify.sh [options]

# TypeScript
npx tsc --noEmit        # Type check
```

## Additional Resources

- **Testing:** See `TESTING_GUIDE.md`
- **WhatsApp:** See `WHATSAPP_INTEGRATION.md`
- **AWS Deploy:** See `AWS_DEPLOYMENT_OPTIONS.md`
- **Architecture:** See `CLAUDE.md`

## Getting Help

1. Check documentation files
2. Review GitHub Actions logs
3. Check test output
4. Review error messages
5. Check dependencies are installed

---

**Setup Time:** ~15 minutes
**First Build:** ~5 minutes
**Typical Build:** ~3 minutes
