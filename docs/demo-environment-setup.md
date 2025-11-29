# Demo Environment Setup Guide

This document provides detailed instructions for setting up the **Demo Environment** for Better Call Buffet, which is used for E2E testing and customer demonstrations.

## Overview

The demo environment is a production-like environment that:
- Runs the same code version as production (mirrors last production deployment)
- Has its own isolated infrastructure and database
- Contains dedicated test accounts for automated testing, QA, and demos
- Serves as the target for daily automated E2E tests

## Architecture

```
Demo Environment Components:
├── Frontend: demo.better-call-buffet.com (Netlify or similar)
├── Backend API: api-demo.better-call-buffet.com
└── Database: Dedicated PostgreSQL instance (isolated from staging/production)
```

## Infrastructure Requirements

### Frontend Deployment

**Hosting**: Netlify, Vercel, or similar JAMstack hosting

**Configuration**:
```toml
# netlify.toml (or equivalent)
[build]
  command = "yarn build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "22.17.0"

[context.demo]
  environment = { VITE_API_BASE_URL = "https://api-demo.better-call-buffet.com/api/v1" }
```

**Deployment Trigger**: Deploy when production is deployed (demo mirrors production code)

**URL**: `https://demo.better-call-buffet.com`

---

### Backend Deployment

**Hosting**: AWS, GCP, Railway, Render, or similar

**Requirements**:
- Same infrastructure configuration as production
- Separate from staging environment
- Can be scaled down (fewer resources than production)

**URL**: `https://api-demo.better-call-buffet.com`

**Environment Variables**:
```bash
NODE_ENV=demo
DATABASE_URL=<demo database connection string>
CORS_ORIGIN=https://demo.better-call-buffet.com
JWT_SECRET=<demo-specific secret>
# ... other backend config
```

**Deployment Trigger**: Deploy when production is deployed

---

### Database Setup

**Database**: PostgreSQL (recommended, or whatever production uses)

**Requirements**:
- Separate instance/schema from staging and production
- Isolated data - no shared connections
- Regular backups (daily recommended)

**Configuration**:
- Same schema as production
- Seed data with test accounts (see below)

---

## Test Accounts Setup

The demo database must contain four types of accounts for different purposes.

### 1. E2E Automated Test Account

**Purpose**: Used exclusively by automated E2E tests (GitHub Actions cron job)

**Credentials**:
```
Email: e2e-test@demo.com
Password: <generate strong password, store in password manager>
Role: standard_user
```

**Requirements**:
- Clean baseline data (minimal accounts and transactions)
- Can be reset to clean state via admin API or database script (optional for future)
- Should not be used for manual testing

**Database Seed Example**:
```sql
-- Create user
INSERT INTO users (email, password_hash, name, role, created_at)
VALUES (
  'e2e-test@demo.com',
  '<bcrypt hash of password>',
  'E2E Test User',
  'standard_user',
  NOW()
);

-- Create baseline accounts
INSERT INTO accounts (user_id, name, type, balance, currency, created_at)
VALUES
  ((SELECT id FROM users WHERE email = 'e2e-test@demo.com'), 'Checking Account', 'CHECKING', 1000.00, 'USD', NOW()),
  ((SELECT id FROM users WHERE email = 'e2e-test@demo.com'), 'Savings Account', 'SAVINGS', 5000.00, 'USD', NOW());

-- Create baseline transactions
INSERT INTO transactions (account_id, amount, description, date, category)
VALUES
  ((SELECT id FROM accounts WHERE name = 'Checking Account' AND user_id = (SELECT id FROM users WHERE email = 'e2e-test@demo.com')),
   -50.00, 'Grocery Store', '2025-01-15', 'GROCERIES'),
  ((SELECT id FROM accounts WHERE name = 'Checking Account' AND user_id = (SELECT id FROM users WHERE email = 'e2e-test@demo.com')),
   2000.00, 'Salary Deposit', '2025-01-01', 'INCOME');
```

---

### 2. QA Manual Test Account

**Purpose**: Used by QA team for manual testing and exploratory testing

**Credentials**:
```
Email: qa-manual@demo.com
Password: <generate password, store in password manager>
Role: standard_user
```

**Requirements**:
- Realistic sample data for testing
- QA team manages their own test data
- Not automatically reset (QA owns this account)

**Database Seed Example**:
```sql
INSERT INTO users (email, password_hash, name, role, created_at)
VALUES (
  'qa-manual@demo.com',
  '<bcrypt hash of password>',
  'QA Manual Tester',
  'standard_user',
  NOW()
);

-- Add realistic accounts and transactions for manual testing
-- QA team will manage additional data
```

---

### 3. Demo Account (Customer Demos)

**Purpose**: Used for customer demonstrations, sales demos, and screenshots

**Credentials**:
```
Email: demo@demo.com
Password: <generate password, store in password manager>
Role: standard_user
```

**Requirements**:
- Polished, realistic financial portfolio
- Diverse data scenarios (multiple accounts, various transaction types, invoices, etc.)
- Maintained carefully (clean, professional-looking data)

**Database Seed Example**:
```sql
INSERT INTO users (email, password_hash, name, role, created_at)
VALUES (
  'demo@demo.com',
  '<bcrypt hash of password>',
  'Demo User',
  'standard_user',
  NOW()
);

-- Create realistic, diverse portfolio
INSERT INTO accounts (user_id, name, type, balance, currency, created_at)
VALUES
  ((SELECT id FROM users WHERE email = 'demo@demo.com'), 'Primary Checking', 'CHECKING', 3245.67, 'USD', NOW()),
  ((SELECT id FROM users WHERE email = 'demo@demo.com'), 'Emergency Savings', 'SAVINGS', 12500.00, 'USD', NOW()),
  ((SELECT id FROM users WHERE email = 'demo@demo.com'), 'Investment Account', 'INVESTMENT', 45230.12, 'USD', NOW());

-- Add diverse transactions, invoices, etc.
-- Make data realistic and impressive for demos
```

---

### 4. Baseline Sample Users (Read-Only Reference)

**Purpose**: Provide realistic background data for UI/UX validation

**Credentials**:
```
demo-1@demo.com - High balance user
demo-2@demo.com - Average user
demo-3@demo.com - Low balance user
```

**Requirements**:
- Diverse financial scenarios
- Not used for active testing (reference data only)
- Can be referenced in tests for specific scenarios

---

## Deployment Setup

### Frontend Deployment (Netlify Example)

1. **Create Demo Site** in Netlify
   - Site name: `better-call-buffet-demo`
   - Custom domain: `demo.better-call-buffet.com`

2. **Configure Build Settings**
   ```
   Build command: yarn build
   Publish directory: .output/public
   Node version: 22.17.0
   ```

3. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://api-demo.better-call-buffet.com/api/v1
   VITE_ENVIRONMENT=demo
   VITE_SENTRY_DSN=<demo-specific Sentry DSN>
   ```

4. **Deploy Triggers**
   - Manual deploy initially
   - Set up to deploy when production deploys (via webhook or GitHub Actions)

---

### Backend Deployment (Generic Cloud Provider)

1. **Provision Infrastructure**
   - Create server/container instance
   - Set up database (PostgreSQL)
   - Configure SSL certificate for `api-demo.better-call-buffet.com`

2. **Set Environment Variables**
   ```bash
   NODE_ENV=demo
   DATABASE_URL=postgresql://user:password@demo-db-host:5432/better_call_buffet_demo
   CORS_ORIGIN=https://demo.better-call-buffet.com
   JWT_SECRET=<demo-specific secret>
   PORT=8000
   ```

3. **Deploy Application**
   - Clone repository
   - Install dependencies
   - Run migrations
   - Seed database with test accounts
   - Start server

4. **Configure Deployment Pipeline**
   - Deploy when production is deployed
   - Can use GitHub Actions, CI/CD pipeline, or manual process

---

### Database Setup

1. **Create Database Instance**
   ```bash
   # Example: PostgreSQL
   createdb better_call_buffet_demo
   ```

2. **Run Migrations**
   ```bash
   yarn migrate:demo
   # or
   npm run migrate -- --env=demo
   ```

3. **Seed Test Accounts**
   ```bash
   yarn seed:demo
   # or
   psql better_call_buffet_demo < seeds/demo-accounts.sql
   ```

4. **Verify Accounts Created**
   ```sql
   SELECT email, name, role FROM users WHERE email LIKE '%@demo.com';
   ```

   Expected output:
   ```
   email                | name              | role
   ---------------------|-------------------|-------------
   e2e-test@demo.com    | E2E Test User     | standard_user
   qa-manual@demo.com   | QA Manual Tester  | standard_user
   demo@demo.com        | Demo User         | standard_user
   demo-1@demo.com      | High Balance User | standard_user
   demo-2@demo.com      | Average User      | standard_user
   demo-3@demo.com      | Low Balance User  | standard_user
   ```

---

## GitHub Secrets Configuration

For automated E2E tests to work in GitHub Actions, configure these secrets:

1. Go to GitHub repository → Settings → Secrets and variables → Actions

2. Add the following secrets:

   **E2E_DEMO_USER_EMAIL**
   ```
   e2e-test@demo.com
   ```

   **E2E_DEMO_USER_PASSWORD**
   ```
   <actual password from password manager>
   ```

   **SLACK_WEBHOOK_URL** (for failure notifications)
   ```
   <Slack webhook URL for #engineering channel>
   ```

---

## Monitoring and Maintenance

### Health Checks

**Frontend Health Check**:
```bash
curl https://demo.better-call-buffet.com
# Should return 200 OK
```

**Backend Health Check**:
```bash
curl https://api-demo.better-call-buffet.com/health
# Should return 200 OK with health status
```

### Daily E2E Test Monitoring

- Tests run at 2 AM daily via GitHub Actions
- Check Slack #engineering channel for failure notifications
- View detailed results in GitHub Actions artifacts

### Database Backup

**Recommended**: Daily automated backups

```bash
# Example backup script
pg_dump better_call_buffet_demo > backups/demo-$(date +%Y%m%d).sql
```

### Credential Rotation

**Quarterly**: Rotate test account passwords

1. Generate new passwords
2. Update password manager
3. Update GitHub Secrets
4. Update database password hashes
5. Notify team of rotation

---

## Reset E2E Test Account (Optional Future Enhancement)

To allow resetting the E2E test account to clean state:

### Option 1: Admin API Endpoint

```typescript
// Backend: POST /admin/reset-test-account
// Requires admin auth token

async function resetE2EAccount() {
  // Delete all accounts and transactions for e2e-test@demo.com
  await db.transaction.deleteMany({
    where: { account: { user: { email: 'e2e-test@demo.com' } } }
  })
  await db.account.deleteMany({
    where: { user: { email: 'e2e-test@demo.com' } }
  })

  // Re-seed baseline data
  await seedE2EAccount()
}
```

### Option 2: Database Script

```bash
# reset-e2e-account.sh
psql better_call_buffet_demo <<EOF
DELETE FROM transactions WHERE account_id IN (
  SELECT id FROM accounts WHERE user_id = (SELECT id FROM users WHERE email = 'e2e-test@demo.com')
);
DELETE FROM accounts WHERE user_id = (SELECT id FROM users WHERE email = 'e2e-test@demo.com');

-- Re-insert baseline accounts and transactions
\i seeds/e2e-baseline.sql
EOF
```

**Trigger**: Run before daily E2E tests if needed

---

## Troubleshooting

### Demo Environment Not Accessible

**Check**:
- DNS records for `demo.better-call-buffet.com` and `api-demo.better-call-buffet.com`
- SSL certificates are valid
- Server/container is running
- Database connection is working

### E2E Tests Failing in CI

**Common Causes**:
1. **Wrong credentials**: Verify GitHub Secrets match database
2. **Demo environment down**: Check health endpoints
3. **Data mismatch**: E2E account might be in unexpected state
4. **Code drift**: Demo not deployed with latest production code

**Debug**:
- Download Playwright report artifact from GitHub Actions
- Check Slack notification for error details
- Manually login to demo environment with E2E credentials
- Review demo environment logs

### Test Account Locked Out

**Solution**:
- Reset password directly in database
- Update GitHub Secrets with new password
- Verify auth mechanism allows login

---

## Security Considerations

### Access Control

- **Demo accounts**: Credentials stored in team password manager
- **E2E credentials**: Only in GitHub Secrets (encrypted)
- **Database**: Restricted access, firewall rules
- **API**: Rate limiting enabled

### Data Privacy

- All demo data is synthetic (no real PII)
- Use realistic but fake account numbers, names, transactions
- Comply with privacy regulations even for test data

### Monitoring

- Monitor demo environment for unusual activity
- Set up alerts for failed login attempts
- Track API usage patterns

---

## Checklist for Setup

### Backend Team

- [ ] Provision backend infrastructure (server/container)
- [ ] Create demo database instance
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Seed test accounts (e2e-test, qa-manual, demo, baseline users)
- [ ] Deploy backend application
- [ ] Verify health endpoint returns 200 OK
- [ ] Configure deployment to mirror production releases

### Frontend Team

- [ ] Create demo site on Netlify (or similar)
- [ ] Configure build settings (Node 22.17.0, build command, publish dir)
- [ ] Set environment variable: `VITE_API_BASE_URL`
- [ ] Configure custom domain: `demo.better-call-buffet.com`
- [ ] Deploy frontend application
- [ ] Verify site loads correctly
- [ ] Configure deployment to mirror production releases

### DevOps Team

- [ ] Set up DNS records for demo and api-demo subdomains
- [ ] Configure SSL certificates
- [ ] Set up database backups (daily recommended)
- [ ] Configure monitoring and alerts
- [ ] Add GitHub Secrets: `E2E_DEMO_USER_EMAIL`, `E2E_DEMO_USER_PASSWORD`, `SLACK_WEBHOOK_URL`
- [ ] Verify GitHub Actions workflow has permissions

### QA Team

- [ ] Receive credentials for qa-manual@demo.com
- [ ] Test manual login to demo environment
- [ ] Populate qa-manual account with test data
- [ ] Document any issues or needed improvements

### Verification

- [ ] Frontend accessible at `https://demo.better-call-buffet.com`
- [ ] Backend API accessible at `https://api-demo.better-call-buffet.com`
- [ ] Manual login works for all test accounts
- [ ] E2E tests run successfully locally against demo: `yarn test:e2e:demo`
- [ ] Daily E2E cron job runs successfully in GitHub Actions

---

## Support and Questions

**Demo Environment Issues**: Contact DevOps team
**E2E Test Failures**: Contact frontend team
**Database/Seeding Questions**: Contact backend team

**Documentation**:
- E2E Testing Guide: `tests/e2e/README.md`
- ADR: `docs/decisions/015-adr-e2e-testing-architecture.md`
