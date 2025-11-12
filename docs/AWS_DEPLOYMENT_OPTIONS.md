# AWS Deployment Options for VGS Assembly Web Ticketing System

**Document Version:** 1.0
**Last Updated:** November 2025
**Application:** Next.js 15 (App Router) with Clojure Backend API

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Architecture Overview](#application-architecture-overview)
3. [Top 3 Recommended AWS Deployment Options](#top-3-recommended-aws-deployment-options)
4. [Detailed Comparison Table](#detailed-comparison-table)
5. [Option 1: AWS App Runner (RECOMMENDED)](#option-1-aws-app-runner-recommended)
6. [Option 2: AWS Amplify Hosting](#option-2-aws-amplify-hosting)
7. [Option 3: AWS ECS with Fargate](#option-3-aws-ecs-with-fargate)
8. [Alternative Options](#alternative-options)
9. [Cost Comparison Breakdown](#cost-comparison-breakdown)
10. [Backend API Integration Patterns](#backend-api-integration-patterns)
11. [Migration Checklist](#migration-checklist)
12. [Security Considerations](#security-considerations)
13. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Executive Summary

### Recommendation: AWS App Runner + AWS App Runner (Dual Service)

**For this specific application, we recommend deploying both the Next.js frontend and Clojure API backend using AWS App Runner as separate services.**

#### Why App Runner?

1. **Simplicity**: No infrastructure management, automatic scaling, and straightforward deployment
2. **Cost-Effective**: Pay-per-use pricing starting at ~$8-15/month for small-medium traffic
3. **Docker Native**: Your existing Dockerfile can be used with minimal modifications
4. **Perfect for SSR**: Handles Next.js server-side rendering efficiently
5. **Integrated Services**: Easy connection between frontend and backend services
6. **CI/CD Ready**: Direct GitHub/ECR integration with automated deployments

#### Key Considerations

- **Backend API**: Deploy Clojure API as separate App Runner service
- **Communication**: Use internal VPC networking or App Runner custom domains
- **Environment Variables**: `NEXT_PUBLIC_API_URL` points to backend App Runner URL
- **Scaling**: Both services auto-scale independently based on traffic
- **Total Estimated Cost**: $15-30/month for combined frontend + backend (low-medium traffic)

---

## Application Architecture Overview

### Current Stack

```
┌─────────────────────────────────────────┐
│   Next.js 15 Frontend (Port 3001)      │
│   - TypeScript                          │
│   - App Router                          │
│   - Client-side rendering heavy         │
│   - localStorage auth                   │
│   - Leaflet maps                        │
│   - API calls to backend                │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
               │ NEXT_PUBLIC_API_URL
               ↓
┌─────────────────────────────────────────┐
│   Clojure API Backend (Port 3000)      │
│   - REST API                            │
│   - Authentication                      │
│   - Business Logic                      │
│   - Database Operations                 │
└─────────────────────────────────────────┘
```

### Key Dependencies

- **Node.js 22** (Alpine)
- **React 18** with Next.js 15
- **Leaflet** for mapping (requires client-side rendering)
- **localStorage** for authentication tokens
- **Environment Variables**: `NEXT_PUBLIC_API_URL`

### Build Requirements

- `npm install --legacy-peer-deps` (due to React 18/19 peer dependency conflicts)
- Next.js build produces standalone output
- Docker support already implemented

---

## Top 3 Recommended AWS Deployment Options

### 1. AWS App Runner ⭐ RECOMMENDED

**Best for:** Teams wanting simplicity, automatic scaling, and minimal DevOps overhead

- ✅ Lowest complexity
- ✅ Great for containerized apps
- ✅ Auto-scaling included
- ✅ Cost-effective for small-medium traffic
- ✅ Easy backend integration

### 2. AWS Amplify Hosting

**Best for:** Teams prioritizing rapid deployment and integrated CI/CD

- ✅ Extremely simple setup
- ✅ Built-in CI/CD from Git
- ✅ Good for Next.js SSR
- ⚠️ Limited backend integration options
- ⚠️ Less control over infrastructure

### 3. AWS ECS with Fargate

**Best for:** Teams needing maximum control, custom networking, and enterprise features

- ✅ Maximum flexibility
- ✅ Advanced deployment strategies (blue-green)
- ✅ VPC networking control
- ⚠️ Higher complexity
- ⚠️ More expensive (~$90+/month)

---

## Detailed Comparison Table

| Criteria | AWS App Runner | AWS Amplify | AWS ECS Fargate |
|----------|---------------|-------------|-----------------|
| **Setup Complexity** | Low ⭐⭐⭐⭐⭐ | Very Low ⭐⭐⭐⭐⭐ | Medium-High ⭐⭐⭐ |
| **Monthly Cost (Small)** | $8-15 | $5-10 | $30-50 |
| **Monthly Cost (Medium)** | $15-30 | $30-70 | $90-150 |
| **Monthly Cost (Large)** | $50-100 | $300-600 | $150-500+ |
| **Next.js 15 Support** | ✅ Full | ✅ Full | ✅ Full |
| **SSR Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Auto-scaling** | ✅ Automatic | ✅ Automatic | ✅ Configurable |
| **Backend Integration** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Docker Support** | ✅ Native | ❌ Not needed | ✅ Native |
| **CI/CD Integration** | GitHub, ECR | GitHub, GitLab | Any (manual setup) |
| **Custom Domain** | ✅ Yes | ✅ Yes | ✅ Yes |
| **HTTPS/SSL** | ✅ Automatic | ✅ Automatic | ✅ Via ALB |
| **VPC Access** | ✅ Yes | ⚠️ Limited | ✅ Full control |
| **Blue-Green Deploy** | ❌ No | ❌ No | ✅ Yes |
| **Infrastructure Control** | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| **DevOps Overhead** | Low | Very Low | High |
| **Learning Curve** | Minimal | Minimal | Steep |
| **Time to Deploy** | 15-30 min | 10-15 min | 1-3 hours |

---

## Option 1: AWS App Runner (RECOMMENDED)

### Overview

AWS App Runner is a fully managed container application service that makes it easy to deploy containerized web applications and APIs without managing infrastructure. It automatically scales based on traffic and integrates seamlessly with GitHub or Amazon ECR.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              AWS App Runner (Frontend)                  │
│  ┌─────────────────────────────────────────────┐       │
│  │   Next.js App (Port 3001)                   │       │
│  │   - Auto HTTPS                               │       │
│  │   - Auto Scaling (0-25 instances)           │       │
│  │   - Health Checks                            │       │
│  └─────────────────────────────────────────────┘       │
│         Custom Domain: ticketing.yourdomain.com         │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ NEXT_PUBLIC_API_URL
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              AWS App Runner (Backend)                   │
│  ┌─────────────────────────────────────────────┐       │
│  │   Clojure API (Port 3000)                   │       │
│  │   - Auto HTTPS                               │       │
│  │   - Auto Scaling                             │       │
│  │   - Database connections                     │       │
│  └─────────────────────────────────────────────┘       │
│         Custom Domain: api.yourdomain.com               │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │   Amazon RDS         │
              │   (PostgreSQL/MySQL) │
              └──────────────────────┘
```

### Pros

✅ **Minimal DevOps**: No EC2, load balancer, or container orchestration management
✅ **Cost-Effective**: Starting at ~$8/month, scales with usage
✅ **Docker Native**: Use existing Dockerfile with minimal changes
✅ **Auto HTTPS**: Automatic SSL/TLS certificates
✅ **GitHub Integration**: Automatic deployments on push
✅ **Easy Backend Pairing**: Deploy backend API as separate App Runner service
✅ **Health Monitoring**: Built-in health checks and auto-restart
✅ **Environment Variables**: Simple configuration management
✅ **Fast Deployment**: 15-30 minutes for initial setup

### Cons

⚠️ **Limited Customization**: Cannot customize underlying infrastructure
⚠️ **No Blue-Green**: Basic deployment strategy only
⚠️ **Region Limitations**: Not available in all AWS regions
⚠️ **Cold Starts**: Minimal but possible with very low traffic
⚠️ **No Lambda@Edge**: Cannot use CloudFront edge computing

### Cost Breakdown

#### Pricing Model

- **Compute**: $0.064 per vCPU-hour, $0.007 per GB-hour
- **Memory**: Charged per GB-hour
- **Requests**: First 100,000 requests free, then $0.001 per 1,000 requests
- **Data Transfer**: Standard AWS rates

#### Example Costs (Medium Traffic)

**Frontend App Runner:**
- 1 vCPU, 2 GB RAM running 24/7
- Compute: 1 vCPU × 720 hours × $0.064 = $46.08
- Memory: 2 GB × 720 hours × $0.007 = $10.08
- Provisioned concurrency (1 instance): $6.50
- **Subtotal**: ~$25/month

**Backend App Runner:**
- 0.5 vCPU, 1 GB RAM running 24/7
- Compute: 0.5 vCPU × 720 hours × $0.064 = $23.04
- Memory: 1 GB × 720 hours × $0.007 = $5.04
- **Subtotal**: ~$15/month

**Total Estimated Cost**: $40-50/month for medium traffic

**Small Traffic** (lower concurrency): $15-25/month
**Large Traffic** (multiple instances): $100-200/month

### Step-by-Step Deployment Guide

#### Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. GitHub repository with your code
4. Docker installed locally for testing

#### Step 1: Prepare Production Dockerfile

Create `Dockerfile.production` in your project root:

```dockerfile
# Multi-stage build for production
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps --only=production

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Update `next.config.js`** to enable standalone mode:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable for App Runner/Docker
}

module.exports = nextConfig
```

#### Step 2: Create Backend App Runner Service (Clojure API)

**Via AWS Console:**

1. Navigate to **AWS App Runner** in the AWS Console
2. Click **Create service**
3. Choose **Source**:
   - **Repository type**: Container registry
   - **Provider**: Amazon ECR (or GitHub if Dockerfile is in repo)
4. Configure **Deployment settings**:
   - **Deployment trigger**: Automatic
5. Configure **Service settings**:
   - **Service name**: `vgs-assembly-api`
   - **Port**: 3000
   - **CPU**: 0.5 vCPU
   - **Memory**: 1 GB
6. Configure **Environment variables**:
   ```
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   PORT=3000
   ```
7. Configure **Auto scaling**:
   - **Min instances**: 1
   - **Max instances**: 5
8. Click **Create & deploy**

**Note the service URL**: `https://abc123.us-east-1.awsapprunner.com`

#### Step 3: Create Frontend App Runner Service

**Via AWS Console:**

1. Navigate to **AWS App Runner**
2. Click **Create service**
3. Choose **Source**:
   - **Repository type**: Source code repository
   - **Provider**: GitHub
   - Connect your GitHub account
   - Select repository: `vgs-assembly-web-ticketing`
   - Branch: `main`
4. Configure **Build settings**:
   - **Runtime**: Docker
   - **Build command**: (leave empty, uses Dockerfile)
   - **Start command**: `npm start`
5. Configure **Service settings**:
   - **Service name**: `vgs-assembly-frontend`
   - **Port**: 3001
   - **CPU**: 1 vCPU
   - **Memory**: 2 GB
6. Configure **Environment variables**:
   ```
   NEXT_PUBLIC_API_URL=https://abc123.us-east-1.awsapprunner.com
   NODE_ENV=production
   ```
7. Configure **Auto scaling**:
   - **Min instances**: 1
   - **Max instances**: 10
   - **Concurrency**: 100 requests per instance
8. Add **Health check**:
   - **Protocol**: HTTP
   - **Path**: `/api/health` (or `/`)
   - **Interval**: 5 seconds
   - **Timeout**: 2 seconds
   - **Healthy threshold**: 1
   - **Unhealthy threshold**: 5
9. Click **Create & deploy**

#### Step 4: Configure Custom Domain (Optional)

1. In App Runner service details, click **Custom domains**
2. Click **Link domain**
3. Enter your domain: `ticketing.yourdomain.com`
4. Follow instructions to add DNS records in Route 53 or your DNS provider
5. Repeat for backend: `api.yourdomain.com`

#### Step 5: Update Frontend Environment Variable

After backend gets custom domain, update frontend:

1. Go to frontend App Runner service
2. Click **Configuration** → **Environment variables**
3. Update `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
4. Click **Deploy** to apply changes

#### Step 6: Test Deployment

```bash
# Test frontend
curl https://your-frontend-url.awsapprunner.com

# Test backend API
curl https://your-backend-url.awsapprunner.com/api/health

# Test authentication flow
curl -X POST https://your-backend-url.awsapprunner.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### Step 7: Set Up CI/CD (GitHub Auto-Deploy)

App Runner automatically redeploys when you push to the configured branch. To customize:

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to App Runner

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Trigger App Runner deployment
        run: |
          aws apprunner start-deployment --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN }}
```

2. Add secrets to GitHub repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `APP_RUNNER_SERVICE_ARN`

### Best Practices

1. **Use VPC Connector** for private backend communication (more secure)
2. **Enable auto-scaling** with appropriate concurrency settings
3. **Set up CloudWatch alarms** for monitoring
4. **Use secrets manager** for sensitive environment variables
5. **Enable WAF** (Web Application Firewall) for production
6. **Implement health check endpoints** in your application
7. **Use custom domains** for professional URLs
8. **Enable access logs** for debugging and analytics

---

## Option 2: AWS Amplify Hosting

### Overview

AWS Amplify is a fully managed service designed for deploying and hosting frontend applications with server-side rendering capabilities. It's optimized for frameworks like Next.js and provides seamless CI/CD integration with Git providers.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              AWS CloudFront (CDN)                       │
│         450+ Edge Locations Worldwide                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              AWS Amplify Hosting                        │
│  ┌──────────────────────────────────────────────┐      │
│  │  Static Assets → S3 Bucket                   │      │
│  │  SSR Pages → Lambda@Edge                     │      │
│  │  API Routes → Lambda Functions               │      │
│  └──────────────────────────────────────────────┘      │
│         Custom Domain: ticketing.yourdomain.com         │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ NEXT_PUBLIC_API_URL
                         │ (External API call)
                         ↓
┌─────────────────────────────────────────────────────────┐
│         Backend API (Separate Deployment)               │
│         - AWS App Runner / EC2 / ECS                    │
│         - Clojure API                                   │
└─────────────────────────────────────────────────────────┘
```

### Pros

✅ **Extremely Simple**: Minimal configuration required
✅ **Git Integration**: Auto-deploy from GitHub/GitLab/Bitbucket
✅ **Global CDN**: CloudFront with 450+ edge locations included
✅ **Preview Deployments**: Automatic branch previews
✅ **Free Tier**: Generous free tier for small projects
✅ **Automatic SSL**: HTTPS enabled by default
✅ **Zero DevOps**: No server management whatsoever
✅ **Fast Static Assets**: Optimized CDN delivery

### Cons

⚠️ **Backend Separation**: Backend API must be deployed separately
⚠️ **Limited VPC Access**: Cannot access private VPC resources easily
⚠️ **Less Control**: Minimal infrastructure customization
⚠️ **Build Limits**: 30-minute build timeout
⚠️ **Feature Lag**: May not support latest Next.js features immediately
⚠️ **CORS Configuration**: Requires proper CORS setup for API calls
⚠️ **No Custom Containers**: Cannot use Docker

### Cost Breakdown

#### Pricing Model

- **Build & Deploy**: $0.01 per build minute
- **Storage**: $0.023 per GB stored per month
- **Data Transfer Out**: $0.15 per GB served
- **Free Tier** (first 12 months):
  - 1,000 build minutes per month
  - 15 GB data transfer out per month
  - 5 GB stored per month

#### Example Costs

**Small Traffic** (5GB transfer, 100 builds/month):
- Build: 100 builds × 5 min × $0.01 = $5
- Data transfer: Free tier covers
- **Total**: ~$5/month

**Medium Traffic** (50GB transfer, 200 builds/month):
- Build: 200 builds × 5 min × $0.01 = $10
- Data transfer: 35GB × $0.15 = $5.25
- Storage: ~$0.50
- **Total**: ~$16/month

**Large Traffic** (500GB transfer, 500 builds/month):
- Build: 500 builds × 5 min × $0.01 = $25
- Data transfer: 485GB × $0.15 = $72.75
- Storage: ~$1
- **Total**: ~$99/month

**Note**: This covers frontend only. Backend API needs separate deployment.

### Step-by-Step Deployment Guide

#### Prerequisites

1. AWS Account
2. GitHub/GitLab/Bitbucket account with repository access
3. Backend API deployed (see Backend Integration section)

#### Step 1: Prepare Your Next.js Application

**Update `next.config.js`**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Amplify handles SSR automatically, no output config needed

  // Configure image optimization
  images: {
    domains: ['your-cdn-domain.com'],
    unoptimized: false, // Let Amplify handle optimization
  },
}

module.exports = nextConfig
```

**Create `amplify.yml`** build specification:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --legacy-peer-deps
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

#### Step 2: Connect GitHub Repository

1. Navigate to **AWS Amplify** in the AWS Console
2. Click **New app** → **Host web app**
3. Choose **GitHub** as your Git provider
4. Click **Connect branch**
5. Authorize AWS Amplify to access your GitHub account
6. Select repository: `vgs-assembly-web-ticketing`
7. Select branch: `main`

#### Step 3: Configure Build Settings

1. **App name**: `vgs-assembly-frontend`
2. **Environment**: `production`
3. Review the auto-detected build settings (amplify.yml)
4. Click **Advanced settings**
5. Add **Environment variables**:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NODE_ENV=production
   ```
6. **Build image**: Choose `Amazon Linux:2023` with Node.js 18+

#### Step 4: Configure Advanced Settings

1. **Service role**: Create or select an IAM role with:
   - S3 access
   - CloudFront access
   - CloudWatch Logs access
2. **Monorepo settings**: Not applicable
3. **Build timeout**: 30 minutes (default)

#### Step 5: Deploy

1. Click **Save and deploy**
2. Amplify will:
   - Provision build environment
   - Clone your repository
   - Run `npm ci --legacy-peer-deps`
   - Run `npm run build`
   - Deploy to S3 and CloudFront
   - Configure SSL certificate
3. Wait 10-15 minutes for initial deployment

#### Step 6: Configure Custom Domain

1. In Amplify app, click **Domain management**
2. Click **Add domain**
3. Enter your domain: `ticketing.yourdomain.com`
4. Click **Configure domain**
5. Amplify will:
   - Create SSL certificate via ACM
   - Provide DNS records (CNAME or ALIAS)
6. Add DNS records to your DNS provider (Route 53 recommended)
7. Wait for DNS propagation (5-30 minutes)

#### Step 7: Set Up Branch-Based Deployments

1. Click **App settings** → **Branch settings**
2. Configure branch rules:
   - `main` → Production environment
   - `develop` → Staging environment
   - Feature branches → Preview deployments
3. Enable **Pull request previews** for automatic PR testing

#### Step 8: Configure CORS for Backend API

Since frontend is on different domain than backend, configure CORS:

**In your Clojure backend**, add CORS headers:

```clojure
;; Example CORS middleware
(def cors-headers
  {"Access-Control-Allow-Origin" "https://ticketing.yourdomain.com"
   "Access-Control-Allow-Methods" "GET, POST, PUT, DELETE, OPTIONS"
   "Access-Control-Allow-Headers" "Content-Type, Authorization"
   "Access-Control-Allow-Credentials" "true"})
```

#### Step 9: Test Deployment

```bash
# Test frontend
curl https://ticketing.yourdomain.com

# Test API connectivity from browser console
fetch('https://api.yourdomain.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

#### Step 10: Monitor and Optimize

1. View **Build history** in Amplify console
2. Check **CloudWatch logs** for errors
3. Monitor **Metrics**:
   - Request count
   - Data transfer
   - Build duration
4. Set up **Alarms** for:
   - Build failures
   - High data transfer
   - Response errors

### CI/CD Configuration

Amplify automatically deploys on Git push. To customize:

**Option 1: Amplify Console Settings**
- Configure auto-build per branch
- Set up email notifications
- Configure webhook triggers

**Option 2: GitHub Actions Integration**

```yaml
name: Notify Amplify

on:
  push:
    branches: [main]

jobs:
  trigger-deployment:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Amplify Build
        run: |
          curl -X POST \
            -H "Content-Type: application/json" \
            -d '{"branch":"main"}' \
            ${{ secrets.AMPLIFY_WEBHOOK_URL }}
```

### Best Practices

1. **Use Branch Previews**: Test changes before merging to main
2. **Environment Variables**: Use Amplify's env var management
3. **Performance Monitoring**: Enable AWS X-Ray for tracing
4. **Custom Headers**: Configure security headers in Amplify settings
5. **Backend Deployment First**: Deploy backend API before frontend
6. **Use Route 53**: For domain management with Amplify
7. **Enable Access Logs**: For debugging and analytics
8. **Optimize Build Time**: Use dependency caching effectively

---

## Option 3: AWS ECS with Fargate

### Overview

Amazon Elastic Container Service (ECS) with Fargate is a fully managed container orchestration platform that runs Docker containers without managing servers. It provides maximum control and flexibility for deploying both frontend and backend services in a production environment.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Route 53 DNS                               │
│         ticketing.yourdomain.com                        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│         Application Load Balancer (ALB)                 │
│         - HTTPS (Port 443)                              │
│         - SSL Certificate (ACM)                         │
│         - Health Checks                                 │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ↓                             ↓
┌────────────────────────┐    ┌────────────────────────┐
│  ECS Service (Frontend) │    │  ECS Service (Backend) │
│  ┌──────────────────┐  │    │  ┌──────────────────┐ │
│  │ Fargate Task     │  │    │  │ Fargate Task     │ │
│  │ (Next.js)        │  │    │  │ (Clojure API)    │ │
│  │ - 1 vCPU         │  │    │  │ - 0.5 vCPU       │ │
│  │ - 2 GB RAM       │  │    │  │ - 1 GB RAM       │ │
│  │ - Port 3001      │  │    │  │ - Port 3000      │ │
│  └──────────────────┘  │    │  └──────────────────┘ │
│  Auto-scaling: 1-10    │    │  Auto-scaling: 1-5    │
└────────────────────────┘    └────────────────────────┘
          │                             │
          └──────────────┬──────────────┘
                         ↓
              ┌──────────────────────┐
              │   Private VPC        │
              │   - Security Groups  │
              │   - Private Subnets  │
              └──────────┬───────────┘
                         ↓
              ┌──────────────────────┐
              │   Amazon RDS         │
              │   (PostgreSQL/MySQL) │
              └──────────────────────┘
```

### Pros

✅ **Maximum Control**: Full infrastructure customization
✅ **VPC Integration**: Private networking with security groups
✅ **Blue-Green Deployments**: Zero-downtime deployments
✅ **Advanced Load Balancing**: ALB with path-based routing
✅ **Service Discovery**: Internal DNS for service communication
✅ **Task Definitions**: Precise container configurations
✅ **Integrated Monitoring**: CloudWatch Container Insights
✅ **Secrets Management**: AWS Secrets Manager integration
✅ **Auto Scaling**: Configurable scaling policies
✅ **Production-Grade**: Enterprise-ready with high availability

### Cons

⚠️ **High Complexity**: Steep learning curve
⚠️ **Higher Costs**: ALB, NAT Gateway, and Fargate tasks add up
⚠️ **Manual Setup**: More infrastructure to configure
⚠️ **Longer Setup Time**: 1-3 hours for initial configuration
⚠️ **DevOps Required**: Needs experienced DevOps engineer
⚠️ **Maintenance Overhead**: More components to monitor and maintain

### Cost Breakdown

#### Pricing Model

**Fargate Compute:**
- vCPU: $0.04048 per vCPU-hour
- Memory: $0.004445 per GB-hour

**Application Load Balancer:**
- ALB: $0.0225 per hour (~$16/month)
- LCU: $0.008 per LCU-hour (varies with traffic)

**Data Transfer:**
- In: Free
- Out to Internet: $0.09 per GB (first 10 TB)

**NAT Gateway** (for private subnets):
- $0.045 per hour (~$32/month)
- $0.045 per GB processed

#### Example Costs

**Small Deployment** (1 frontend, 1 backend task 24/7):

*Frontend Task (1 vCPU, 2 GB):*
- vCPU: 1 × 720h × $0.04048 = $29.15
- Memory: 2 GB × 720h × $0.004445 = $6.40
- Subtotal: $35.55

*Backend Task (0.5 vCPU, 1 GB):*
- vCPU: 0.5 × 720h × $0.04048 = $14.57
- Memory: 1 GB × 720h × $0.004445 = $3.20
- Subtotal: $17.77

*Infrastructure:*
- ALB: $16.20
- NAT Gateway: $32.40
- Data transfer (10 GB): $0.90

**Total: ~$103/month**

**Medium Deployment** (2 frontend, 2 backend tasks):
- Fargate tasks: ~$107
- Infrastructure: ~$50
- **Total: ~$157/month**

**Large Deployment** (5 frontend, 3 backend tasks):
- Fargate tasks: ~$221
- Infrastructure: ~$70
- **Total: ~$291/month**

### Step-by-Step Deployment Guide

#### Prerequisites

1. AWS CLI configured
2. Docker installed locally
3. ECR (Elastic Container Registry) created
4. VPC with public and private subnets
5. RDS database (optional, for backend)

#### Step 1: Create Production Dockerfile

Already covered in App Runner section. Use the same `Dockerfile.production`.

#### Step 2: Push Docker Images to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repositories
aws ecr create-repository --repository-name vgs-assembly-frontend
aws ecr create-repository --repository-name vgs-assembly-backend

# Build and tag frontend image
docker build -t vgs-assembly-frontend:latest \
  -f Dockerfile.production .
docker tag vgs-assembly-frontend:latest \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vgs-assembly-frontend:latest

# Push frontend image
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vgs-assembly-frontend:latest

# Repeat for backend
docker build -t vgs-assembly-backend:latest \
  -f ../backend/Dockerfile .
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vgs-assembly-backend:latest
```

#### Step 3: Create ECS Cluster

```bash
# Create ECS cluster
aws ecs create-cluster \
  --cluster-name vgs-assembly-cluster \
  --region us-east-1
```

Or via AWS Console:
1. Navigate to **ECS**
2. Click **Create cluster**
3. Choose **Networking only** (Fargate)
4. Name: `vgs-assembly-cluster`
5. Enable **Container Insights** for monitoring
6. Click **Create**

#### Step 4: Create Task Definitions

**Frontend Task Definition** (`frontend-task-def.json`):

```json
{
  "family": "vgs-assembly-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vgs-assembly-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "NEXT_PUBLIC_API_URL",
          "value": "https://api.yourdomain.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/vgs-assembly-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/ || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

**Backend Task Definition** (`backend-task-def.json`):

```json
{
  "family": "vgs-assembly-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vgs-assembly-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/vgs-assembly-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register task definitions:

```bash
aws ecs register-task-definition \
  --cli-input-json file://frontend-task-def.json

aws ecs register-task-definition \
  --cli-input-json file://backend-task-def.json
```

#### Step 5: Create Application Load Balancer

**Via AWS Console:**

1. Navigate to **EC2** → **Load Balancers**
2. Click **Create Load Balancer**
3. Choose **Application Load Balancer**
4. **Name**: `vgs-assembly-alb`
5. **Scheme**: Internet-facing
6. **IP address type**: IPv4
7. **VPC**: Select your VPC
8. **Subnets**: Select at least 2 public subnets in different AZs
9. **Security group**: Create new or select existing:
   - Allow inbound: Port 80 (HTTP), Port 443 (HTTPS)
   - Allow outbound: All traffic
10. Click **Create load balancer**

#### Step 6: Create Target Groups

**Frontend Target Group:**

1. Navigate to **EC2** → **Target Groups**
2. Click **Create target group**
3. **Target type**: IP addresses (for Fargate)
4. **Name**: `vgs-frontend-tg`
5. **Protocol**: HTTP, **Port**: 3001
6. **VPC**: Select your VPC
7. **Health check path**: `/`
8. **Health check interval**: 30 seconds
9. Click **Create**

**Backend Target Group:**

Repeat with:
- **Name**: `vgs-backend-tg`
- **Port**: 3000
- **Health check path**: `/api/health`

#### Step 7: Configure ALB Listeners

1. Select your ALB
2. Go to **Listeners** tab
3. Add **HTTP:80** listener:
   - Default action: Redirect to HTTPS
4. Add **HTTPS:443** listener:
   - Default action: Forward to `vgs-frontend-tg`
   - SSL certificate: Select or import certificate from ACM
5. Add **Listener rules** for backend:
   - IF path is `/api/*`
   - THEN forward to `vgs-backend-tg`

#### Step 8: Create ECS Services

**Backend Service:**

```bash
aws ecs create-service \
  --cluster vgs-assembly-cluster \
  --service-name vgs-backend-service \
  --task-definition vgs-assembly-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxx,subnet-yyy],
    securityGroups=[sg-xxx],
    assignPublicIp=DISABLED
  }" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...:targetgroup/vgs-backend-tg,containerName=backend,containerPort=3000" \
  --health-check-grace-period-seconds 60 \
  --enable-execute-command
```

**Frontend Service:**

```bash
aws ecs create-service \
  --cluster vgs-assembly-cluster \
  --service-name vgs-frontend-service \
  --task-definition vgs-assembly-frontend \
  --desired-count 2 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxx,subnet-yyy],
    securityGroups=[sg-xxx],
    assignPublicIp=DISABLED
  }" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...:targetgroup/vgs-frontend-tg,containerName=frontend,containerPort=3001" \
  --health-check-grace-period-seconds 60 \
  --enable-execute-command
```

#### Step 9: Configure Auto Scaling

**Create Application Auto Scaling targets:**

```bash
# Frontend scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/vgs-assembly-cluster/vgs-frontend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 1 \
  --max-capacity 10

# Create scaling policy (CPU-based)
aws application-autoscaling put-scaling-policy \
  --policy-name frontend-cpu-scaling \
  --service-namespace ecs \
  --resource-id service/vgs-assembly-cluster/vgs-frontend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
```

Repeat for backend service.

#### Step 10: Configure Route 53

1. Navigate to **Route 53** → **Hosted zones**
2. Select your domain
3. Create **A record**:
   - **Name**: `ticketing.yourdomain.com`
   - **Type**: A - IPv4 address
   - **Alias**: Yes
   - **Alias target**: Select your ALB
   - **Routing policy**: Simple routing
4. Create **A record** for API:
   - **Name**: `api.yourdomain.com`
   - **Alias target**: Same ALB (will route via path-based rules)

#### Step 11: Test Deployment

```bash
# Check service status
aws ecs describe-services \
  --cluster vgs-assembly-cluster \
  --services vgs-frontend-service vgs-backend-service

# Check task health
aws ecs list-tasks \
  --cluster vgs-assembly-cluster \
  --service-name vgs-frontend-service

# Test endpoints
curl https://ticketing.yourdomain.com
curl https://ticketing.yourdomain.com/api/health
```

#### Step 12: Set Up CI/CD Pipeline

Create `.github/workflows/deploy-ecs.yml`:

```yaml
name: Deploy to ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push frontend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: vgs-assembly-frontend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            -f Dockerfile.production .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster vgs-assembly-cluster \
            --service vgs-frontend-service \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster vgs-assembly-cluster \
            --services vgs-frontend-service
```

### Best Practices

1. **Use Private Subnets**: Deploy tasks in private subnets with NAT gateway
2. **Security Groups**: Implement least-privilege security group rules
3. **Secrets Manager**: Store credentials in AWS Secrets Manager, not env vars
4. **Container Insights**: Enable for detailed monitoring
5. **Log Aggregation**: Use CloudWatch Logs Insights for debugging
6. **Blue-Green Deployments**: Use ECS deployment controller
7. **Task Roles**: Grant minimal IAM permissions per task
8. **Health Checks**: Configure proper health check endpoints
9. **Resource Limits**: Set CPU and memory limits appropriately
10. **Cost Monitoring**: Use AWS Cost Explorer and set budget alerts

---

## Alternative Options

### Option 4: Amazon S3 + CloudFront (Static Export)

**When to Use:** If you can export Next.js to static HTML (no SSR)

#### Pros
- Extremely low cost ($1-5/month)
- Best performance (pure CDN)
- Infinite scalability
- Simple deployment

#### Cons
- **No SSR**: Must use `output: 'export'` in next.config.js
- **No API routes**: Cannot use Next.js API routes
- **No dynamic routes with fallback**: Limited dynamic routing
- **Client-side only**: All rendering happens in browser

#### Cost
- S3: $0.023/GB/month storage
- CloudFront: $0.085/GB first 10 TB
- **Total: $1-10/month** depending on traffic

#### Quick Setup

```bash
# 1. Configure next.config.js
# output: 'export'

# 2. Build static export
npm run build

# 3. Upload to S3
aws s3 sync out/ s3://your-bucket-name

# 4. Create CloudFront distribution
# Point to S3 bucket, configure index.html as default
```

**Verdict**: Only viable if you can convert to static site (unlikely with localStorage auth and dynamic data).

---

### Option 5: AWS Elastic Beanstalk

**When to Use:** Legacy applications, teams familiar with Elastic Beanstalk

#### Pros
- Managed platform
- Auto-scaling and load balancing
- Rolling deployments
- Monitoring included

#### Cons
- Higher cost than App Runner (~$30-40/month)
- Older technology
- Less Docker-optimized than ECS
- More complex than Amplify/App Runner

#### Cost
- EC2 instances: ~$20-30/month
- Load Balancer: ~$16/month
- **Total: $36-50/month minimum**

#### Verdict
Not recommended. App Runner or ECS are better choices for new deployments.

---

### Option 6: EC2 with Self-Managed Setup

**When to Use:** Maximum control, very specific requirements, DevOps expertise

#### Pros
- Complete control
- Can optimize costs with Reserved Instances
- Custom configurations
- Direct server access

#### Cons
- High DevOps overhead
- Manual scaling
- Security management required
- Time-consuming setup
- You manage everything (OS, updates, security patches)

#### Cost
- EC2 t3.medium: ~$30/month
- Load Balancer: ~$16/month
- Management overhead: Significant time cost
- **Total: $50+/month plus DevOps time**

#### Verdict
Only for teams with dedicated DevOps resources and specific needs not met by managed services.

---

## Cost Comparison Breakdown

### Monthly Cost Summary (Medium Traffic: ~50GB transfer, 2-3 instances)

| Service | Frontend | Backend | Infrastructure | Total | Setup Time |
|---------|----------|---------|----------------|-------|------------|
| **App Runner** | $15-20 | $10-15 | $0 | **$25-35** | 30 min |
| **Amplify** | $15-25 | N/A* | $0 | **$15-25** + Backend | 15 min |
| **ECS Fargate** | $35-45 | $18-25 | $50-60 | **$103-130** | 2-3 hours |
| **S3 + CloudFront** | $5-10 | N/A* | $0 | **$5-10** + Backend | 1 hour |
| **Elastic Beanstalk** | $30-40 | $30-40 | $16 | **$76-96** | 1-2 hours |
| **EC2 Self-Managed** | $30 | $30 | $16 | **$76+** | 4+ hours |

**Note:** Amplify and S3+CloudFront require separate backend deployment (add $10-20/month for backend).

### Cost Scaling by Traffic Level

#### Small Traffic (10GB transfer, 1 instance)
- **App Runner**: $15-20/month
- **Amplify**: $5-10/month (+ backend)
- **ECS Fargate**: $70-90/month
- **S3 + CloudFront**: $1-5/month (+ backend)

#### Medium Traffic (50GB transfer, 2-3 instances)
- **App Runner**: $25-40/month
- **Amplify**: $15-30/month (+ backend)
- **ECS Fargate**: $103-157/month
- **S3 + CloudFront**: $5-15/month (+ backend)

#### Large Traffic (500GB transfer, 5-10 instances)
- **App Runner**: $100-200/month
- **Amplify**: $100-300/month (+ backend)
- **ECS Fargate**: $250-500/month
- **S3 + CloudFront**: $40-70/month (+ backend)

### Hidden Costs to Consider

1. **NAT Gateway** (ECS only): ~$32/month + $0.045/GB processed
2. **Data Transfer**: AWS charges for data OUT ($0.09/GB first 10TB)
3. **CloudWatch Logs**: $0.50/GB ingested, $0.03/GB stored
4. **SSL Certificates**: Free with AWS Certificate Manager (ACM)
5. **Route 53**: $0.50/month per hosted zone + $0.40/million queries
6. **Secrets Manager**: $0.40/secret/month + $0.05/10,000 API calls
7. **Developer Time**: App Runner saves 10-20 hours/month vs ECS

### Cost Optimization Tips

1. **Use Spot Instances** (ECS only): Save up to 70%
2. **Compute Savings Plans**: Save up to 50% on Fargate
3. **CloudFront Caching**: Reduce origin requests
4. **Compress Assets**: Enable gzip/brotli compression
5. **Image Optimization**: Use Next.js Image optimization
6. **Log Retention**: Set appropriate CloudWatch log retention (7-30 days)
7. **Right-Sizing**: Monitor and adjust CPU/memory allocations
8. **Reserved Capacity** (App Runner): Save with provisioned concurrency
9. **Delete Old Images**: Clean up old ECR images regularly
10. **Budget Alerts**: Set up AWS Budgets to monitor spending

---

## Backend API Integration Patterns

Your Clojure backend needs to be deployed alongside the Next.js frontend. Here are the recommended integration patterns:

### Pattern 1: Dual App Runner Services (RECOMMENDED)

**Architecture:**
```
Frontend (App Runner) → Backend (App Runner) → Database (RDS)
```

**Setup:**
1. Deploy backend Clojure API as separate App Runner service
2. Configure frontend `NEXT_PUBLIC_API_URL` to backend App Runner URL
3. Enable CORS on backend for frontend domain
4. Use AWS VPC connector for private communication (optional)

**Pros:**
- Simple setup
- Independent scaling
- Low cost
- Easy maintenance

**Cons:**
- Public internet communication (unless using VPC connector)
- CORS configuration required

**Code Example:**

```typescript
// Frontend: src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// In production: https://your-backend.us-east-1.awsapprunner.com
```

**Backend CORS Configuration (Clojure):**

```clojure
(def cors-config
  {:allowed-origins ["https://your-frontend.us-east-1.awsapprunner.com"
                     "https://ticketing.yourdomain.com"]
   :allowed-methods [:get :post :put :delete :options]
   :allowed-headers ["Content-Type" "Authorization"]
   :allow-credentials true})
```

---

### Pattern 2: ECS Services with ALB Path Routing

**Architecture:**
```
ALB → /api/* → Backend ECS Service
ALB → /* → Frontend ECS Service
```

**Setup:**
1. Deploy both services to same ECS cluster
2. Configure ALB listener rules for path-based routing
3. Frontend calls same domain: `/api/health`
4. No CORS needed (same origin)

**Pros:**
- No CORS issues
- Single domain
- Private VPC networking
- Better security

**Cons:**
- Higher complexity
- More expensive
- Requires ECS setup

**ALB Listener Rules:**

```json
{
  "Rules": [
    {
      "Priority": 1,
      "Conditions": [
        {
          "Field": "path-pattern",
          "Values": ["/api/*"]
        }
      ],
      "Actions": [
        {
          "Type": "forward",
          "TargetGroupArn": "arn:aws:elasticloadbalancing:...:vgs-backend-tg"
        }
      ]
    },
    {
      "Priority": 2,
      "Conditions": [
        {
          "Field": "path-pattern",
          "Values": ["/*"]
        }
      ],
      "Actions": [
        {
          "Type": "forward",
          "TargetGroupArn": "arn:aws:elasticloadbalancing:...:vgs-frontend-tg"
        }
      ]
    }
  ]
}
```

---

### Pattern 3: Amplify + API Gateway + Lambda

**Architecture:**
```
Amplify (Frontend) → API Gateway → Lambda (Backend) → RDS
```

**Setup:**
1. Deploy frontend to Amplify
2. Package Clojure backend as AWS Lambda (using GraalVM native image)
3. Create API Gateway REST API
4. Configure `NEXT_PUBLIC_API_URL` to API Gateway URL

**Pros:**
- Serverless backend
- Pay per request
- Auto-scaling
- Low cost for sporadic traffic

**Cons:**
- Cold starts
- Lambda size limits (250MB)
- Clojure + Lambda = more complex
- API Gateway costs

**Verdict:** Not recommended for Clojure backend (better suited for Node.js/Python).

---

### Pattern 4: VPC Peering / PrivateLink

**Architecture:**
```
Frontend (Public) → VPC PrivateLink → Backend (Private VPC)
```

**Setup:**
1. Deploy backend in private VPC
2. Create VPC endpoint service
3. Frontend connects via private endpoint
4. No public internet exposure for backend

**Pros:**
- Maximum security
- No public internet traffic
- Compliant with strict security policies

**Cons:**
- Complex setup
- Higher cost
- Requires VPC knowledge

**Use Case:** Enterprise deployments with strict security requirements.

---

### Backend Deployment Options Comparison

| Option | Complexity | Cost | Performance | Scaling |
|--------|-----------|------|-------------|---------|
| **App Runner** | ⭐⭐⭐⭐⭐ Low | $10-20/mo | ⭐⭐⭐⭐ | Automatic |
| **ECS Fargate** | ⭐⭐⭐ Medium | $20-50/mo | ⭐⭐⭐⭐⭐ | Configurable |
| **Lambda** | ⭐⭐⭐ Medium | $5-15/mo | ⭐⭐⭐ (cold starts) | Automatic |
| **EC2** | ⭐⭐ High | $30+/mo | ⭐⭐⭐⭐ | Manual/ASG |
| **Elastic Beanstalk** | ⭐⭐⭐⭐ Low | $30-40/mo | ⭐⭐⭐⭐ | Automatic |

**Recommendation for Clojure Backend:** Use **App Runner** or **ECS Fargate** (not Lambda).

---

### Environment Variable Configuration

#### Frontend Environment Variables

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**How to set in each service:**

**App Runner:**
- Console: Configuration → Environment variables
- CLI: `--environment-variables` parameter

**Amplify:**
- Console: App Settings → Environment variables
- Auto-detected from `.env.production`

**ECS:**
- Task Definition → `environment` or `secrets` array
- Use Secrets Manager for sensitive values

#### Backend Environment Variables

```bash
# Backend API environment
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secure-secret-key
PORT=3000
CORS_ALLOWED_ORIGINS=https://ticketing.yourdomain.com
```

**Security Best Practices:**
1. **Never commit secrets** to Git
2. Use **AWS Secrets Manager** for sensitive values
3. Use **IAM roles** for AWS service access (not API keys)
4. Rotate secrets regularly
5. Use **Parameter Store** for non-sensitive config

---

## Migration Checklist

### Pre-Migration

- [ ] **Audit current application**
  - [ ] Identify all API endpoints used by frontend
  - [ ] Document authentication flow
  - [ ] List all environment variables
  - [ ] Check for hardcoded localhost URLs
  - [ ] Review localStorage usage

- [ ] **Prepare production Dockerfile**
  - [ ] Test multi-stage build locally
  - [ ] Verify standalone output works
  - [ ] Test with production environment variables
  - [ ] Ensure health check endpoint exists

- [ ] **Set up AWS prerequisites**
  - [ ] Create AWS account
  - [ ] Configure AWS CLI
  - [ ] Set up IAM users/roles with appropriate permissions
  - [ ] Create VPC (if using ECS)
  - [ ] Set up domain in Route 53 (optional)

- [ ] **Backend preparation**
  - [ ] Deploy backend API to chosen platform
  - [ ] Test backend API endpoints
  - [ ] Configure CORS for frontend domains
  - [ ] Set up database (RDS, DocumentDB, etc.)
  - [ ] Test database connectivity

### During Migration

- [ ] **Frontend deployment**
  - [ ] Choose deployment option (App Runner recommended)
  - [ ] Configure build settings
  - [ ] Set environment variables
  - [ ] Deploy initial version
  - [ ] Test basic functionality

- [ ] **Domain configuration**
  - [ ] Set up custom domain for frontend
  - [ ] Set up custom domain for backend API
  - [ ] Configure SSL certificates
  - [ ] Test HTTPS access

- [ ] **Integration testing**
  - [ ] Test API connectivity
  - [ ] Test authentication flow
  - [ ] Test map rendering (Leaflet)
  - [ ] Test all major user flows
  - [ ] Check browser console for errors
  - [ ] Verify CORS configuration

- [ ] **Performance optimization**
  - [ ] Enable gzip/brotli compression
  - [ ] Configure caching headers
  - [ ] Test page load times
  - [ ] Check Core Web Vitals
  - [ ] Optimize images

### Post-Migration

- [ ] **Monitoring setup**
  - [ ] Configure CloudWatch alarms
  - [ ] Set up error tracking (Sentry, CloudWatch Logs Insights)
  - [ ] Create dashboards for key metrics
  - [ ] Set up uptime monitoring
  - [ ] Configure cost alerts

- [ ] **CI/CD pipeline**
  - [ ] Set up GitHub Actions workflow
  - [ ] Test automated deployments
  - [ ] Configure staging environment
  - [ ] Set up preview deployments (for Amplify)

- [ ] **Security hardening**
  - [ ] Enable WAF (Web Application Firewall)
  - [ ] Configure security headers
  - [ ] Set up DDoS protection (AWS Shield)
  - [ ] Review IAM permissions (least privilege)
  - [ ] Enable CloudTrail for audit logging

- [ ] **Documentation**
  - [ ] Document deployment process
  - [ ] Create runbook for common issues
  - [ ] Document environment variables
  - [ ] Update README with production URLs
  - [ ] Create architecture diagram

- [ ] **User communication**
  - [ ] Announce migration schedule
  - [ ] Prepare rollback plan
  - [ ] Monitor user feedback
  - [ ] Address issues promptly

---

## Security Considerations

### 1. HTTPS/SSL Configuration

**All Options:**
- AWS automatically provides SSL certificates via AWS Certificate Manager (ACM)
- HTTPS is enabled by default
- Redirects HTTP → HTTPS automatically

**Best Practices:**
- Use TLS 1.2 or higher
- Enable HSTS (HTTP Strict Transport Security)
- Configure secure cookies for authentication

### 2. Environment Variables & Secrets

**DO:**
- ✅ Use AWS Secrets Manager for sensitive values
- ✅ Use Parameter Store for non-sensitive config
- ✅ Prefix public variables with `NEXT_PUBLIC_`
- ✅ Rotate secrets regularly

**DON'T:**
- ❌ Commit secrets to Git
- ❌ Expose backend secrets to frontend
- ❌ Use hardcoded credentials
- ❌ Share secrets in plain text

**Example: Using Secrets Manager in ECS**

```json
{
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:123456:secret:db-url-abc123"
    }
  ]
}
```

### 3. CORS Configuration

**Backend API must allow frontend domain:**

```clojure
;; Clojure Ring middleware
(def cors-config
  {:allowed-origins #{"https://ticketing.yourdomain.com"
                      "https://staging.ticketing.yourdomain.com"}
   :allowed-methods [:get :post :put :delete :options]
   :allowed-headers ["Content-Type" "Authorization"]
   :allow-credentials true
   :max-age 3600})
```

**Security Tips:**
- Only allow specific origins (not `*`)
- Enable credentials only if needed
- Limit allowed methods to what you use
- Set appropriate `max-age` for preflight caching

### 4. Authentication & Authorization

**Current Setup (localStorage):**
```typescript
// Frontend stores JWT token
localStorage.setItem('auth_token', token);

// Sent in API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Security Improvements:**
1. **Use httpOnly cookies** instead of localStorage (prevents XSS)
2. **Implement token refresh** mechanism
3. **Add CSRF protection** for state-changing operations
4. **Rate limit** authentication endpoints
5. **Log authentication events** to CloudWatch

**Enhanced Auth Flow:**
```typescript
// Frontend: Set secure cookie
document.cookie = `auth_token=${token}; Secure; HttpOnly; SameSite=Strict`;

// Backend: Validate and extract token from cookie
// This prevents XSS attacks from stealing tokens
```

### 5. Security Headers

**Configure these headers in your responses:**

```typescript
// Next.js: next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 6. Network Security

**App Runner:**
- Supports VPC connector for private resource access
- Automatic DDoS protection

**ECS Fargate:**
- Deploy in private subnets
- Use security groups to control traffic
- NAT Gateway for outbound internet access
- VPC Flow Logs for network monitoring

**Example Security Group (ECS):**
```json
{
  "IpProtocol": "tcp",
  "FromPort": 3001,
  "ToPort": 3001,
  "SourceSecurityGroupId": "sg-alb-xxx",  // Only ALB can access
  "Description": "Allow inbound from ALB only"
}
```

### 7. Web Application Firewall (WAF)

**Enable AWS WAF for:**
- SQL injection protection
- XSS attack prevention
- Rate limiting
- IP blocking
- Geo-blocking

**Cost:** ~$5-10/month + $1 per million requests

**Setup:**
1. Create WAF Web ACL
2. Add managed rule groups (Core Rule Set, Known Bad Inputs)
3. Add rate-based rules (e.g., 1000 requests per 5 minutes)
4. Associate with ALB or CloudFront distribution

### 8. Logging & Monitoring

**Enable:**
- CloudWatch Logs for application logs
- AWS CloudTrail for API audit logs
- VPC Flow Logs (for ECS)
- ALB access logs
- WAF logs

**Set up alerts for:**
- Failed authentication attempts
- 5xx errors
- High latency
- Unusual traffic patterns
- Cost anomalies

### 9. Compliance Considerations

**For regulated industries:**
- Enable encryption at rest (EBS, RDS, S3)
- Enable encryption in transit (TLS 1.2+)
- Implement data retention policies
- Set up audit logging
- Use AWS Config for compliance monitoring
- Consider AWS PrivateLink for private connectivity

---

## Monitoring and Maintenance

### CloudWatch Metrics to Monitor

#### Frontend Metrics
- **Request Count**: Total requests per minute
- **Latency**: P50, P90, P95, P99 response times
- **Error Rate**: 4xx and 5xx responses
- **CPU/Memory Usage**: For App Runner or ECS tasks
- **Network I/O**: Data transfer rates

#### Backend Metrics
- **API Response Time**: Per endpoint
- **Database Connection Pool**: Active/idle connections
- **Error Rate**: Application errors
- **Authentication Success Rate**
- **Request Queue Depth**: For async processing

### CloudWatch Alarms

**Recommended Alarms:**

```yaml
# High error rate
- Alarm: HighErrorRate
  Metric: HTTPCode_Target_5XX_Count
  Threshold: > 10 in 5 minutes
  Action: Send SNS notification

# High latency
- Alarm: HighLatency
  Metric: TargetResponseTime
  Threshold: > 2 seconds (P95)
  Action: Send SNS notification

# Low healthy hosts
- Alarm: UnhealthyHosts
  Metric: UnHealthyHostCount
  Threshold: > 0 for 2 minutes
  Action: Send SNS notification, trigger auto-scaling

# High CPU
- Alarm: HighCPU
  Metric: CPUUtilization
  Threshold: > 80% for 5 minutes
  Action: Scale up, send notification
```

### Logging Best Practices

**Structured Logging:**

```typescript
// Frontend: Use console with context
console.log(JSON.stringify({
  level: 'info',
  message: 'API request completed',
  endpoint: '/api/transactions',
  duration: 123,
  status: 200,
  userId: 'user-123',
  timestamp: new Date().toISOString()
}));
```

**Log Aggregation:**
- Use CloudWatch Logs Insights for querying
- Set appropriate retention (7-30 days for most apps)
- Export to S3 for long-term storage (cheaper)

**Example Query:**

```sql
fields @timestamp, @message
| filter @message like /error/
| stats count() by bin(5m)
```

### Performance Monitoring

**Core Web Vitals:**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

**Tools:**
- Google Lighthouse (CI/CD integration)
- AWS CloudWatch RUM (Real User Monitoring)
- Third-party: New Relic, Datadog, Sentry

### Maintenance Tasks

**Weekly:**
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor costs
- [ ] Review security alerts

**Monthly:**
- [ ] Update dependencies (`npm update`)
- [ ] Review and optimize CloudWatch log retention
- [ ] Analyze traffic patterns
- [ ] Review and adjust auto-scaling policies
- [ ] Check SSL certificate expiration
- [ ] Review IAM permissions

**Quarterly:**
- [ ] Security audit
- [ ] Cost optimization review
- [ ] Performance optimization
- [ ] Disaster recovery test
- [ ] Update documentation

### Backup and Disaster Recovery

**Database Backups (RDS):**
- Enable automated backups (7-35 day retention)
- Take manual snapshots before major changes
- Test restore process quarterly

**Application Backups:**
- Git repository is source of truth
- Store Docker images in ECR (with lifecycle policies)
- Export CloudFormation/Terraform templates

**Disaster Recovery Plan:**
1. **RPO (Recovery Point Objective)**: < 1 hour (database backups every 5 minutes)
2. **RTO (Recovery Time Objective)**: < 30 minutes (automated deployment)
3. **Multi-Region**: Consider for critical applications
4. **Rollback Strategy**: Keep previous 5 Docker images in ECR

**Example Rollback:**

```bash
# App Runner: Rollback to previous deployment
aws apprunner list-operations --service-arn SERVICE_ARN
aws apprunner start-deployment --service-arn SERVICE_ARN --deployment-id PREVIOUS_ID

# ECS: Update service to previous task definition
aws ecs update-service \
  --cluster vgs-assembly-cluster \
  --service vgs-frontend-service \
  --task-definition vgs-assembly-frontend:PREVIOUS_VERSION
```

### Cost Monitoring

**Set up AWS Budgets:**
1. Navigate to AWS Billing → Budgets
2. Create budget:
   - Type: Cost budget
   - Amount: $100/month (adjust as needed)
   - Alerts at: 80%, 100%, 120% of budget
3. Add email notifications

**Cost Optimization Strategies:**
- Review AWS Cost Explorer monthly
- Use AWS Compute Optimizer recommendations
- Right-size EC2/Fargate tasks
- Use spot instances (where applicable)
- Implement CloudFront caching
- Clean up unused resources (old ECR images, unused EBS volumes)

---

## Conclusion

### Final Recommendation

**For VGS Assembly Web Ticketing System, we recommend:**

**Option 1: AWS App Runner (Dual Service)**
- **Frontend**: Next.js 15 on App Runner
- **Backend**: Clojure API on App Runner
- **Database**: Amazon RDS (PostgreSQL/MySQL)
- **Estimated Cost**: $30-50/month
- **Setup Time**: 30-60 minutes

**Why?**
1. **Simplicity**: Minimal DevOps overhead
2. **Cost-Effective**: Lower cost than ECS for small-medium traffic
3. **Docker-Native**: Works with existing Dockerfile
4. **Auto-Scaling**: Handles traffic spikes automatically
5. **Quick to Market**: Deploy in under an hour

### When to Consider Alternatives

**Choose Amplify if:**
- You want the absolute simplest deployment
- You're willing to deploy backend separately
- You don't need Docker

**Choose ECS Fargate if:**
- You need maximum control and flexibility
- You have complex networking requirements
- You need blue-green deployments
- You have DevOps expertise in-house
- You're building enterprise-grade infrastructure

**Choose S3 + CloudFront if:**
- You can convert to static site (no SSR)
- You have completely separate backend API
- Cost is primary concern ($5/month vs $30/month)

### Next Steps

1. **Immediate (Week 1)**
   - Set up AWS account
   - Deploy backend API to App Runner
   - Test backend endpoints

2. **Short-term (Week 2)**
   - Deploy frontend to App Runner
   - Configure custom domains
   - Set up SSL certificates
   - Integration testing

3. **Medium-term (Month 1)**
   - Set up CI/CD pipeline
   - Configure monitoring and alerts
   - Security hardening
   - Performance optimization

4. **Long-term (Ongoing)**
   - Monitor costs and optimize
   - Scale as needed
   - Regular security updates
   - Continuous improvement

---

## Additional Resources

### AWS Documentation
- [AWS App Runner Developer Guide](https://docs.aws.amazon.com/apprunner/)
- [AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Amazon ECS Developer Guide](https://docs.aws.amazon.com/ecs/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

### Cost Calculators
- [AWS Pricing Calculator](https://calculator.aws/)
- [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/)

### Monitoring Tools
- [AWS CloudWatch](https://aws.amazon.com/cloudwatch/)
- [AWS X-Ray](https://aws.amazon.com/xray/)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Security Resources
- [AWS WAF](https://aws.amazon.com/waf/)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Document Maintained By:** DevOps Team
**Last Review Date:** November 2025
**Next Review Date:** February 2026

For questions or support, contact: [devops@yourdomain.com](mailto:devops@yourdomain.com)
