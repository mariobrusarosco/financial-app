# GitHub Actions Setup

## Daily E2E Tests

The `e2e-daily.yml` workflow runs automated E2E tests against the main branch every day at 2 AM UTC.

### Features
- ✅ Runs daily at 2 AM UTC (configurable)
- ✅ Can be manually triggered from GitHub UI
- ✅ Creates GitHub issues on test failures
- ✅ Uploads test artifacts (screenshots, videos, reports)
- ✅ Caches dependencies for faster runs

### Required GitHub Secrets (Optional)

If you want to test against different environments, configure these in Settings > Secrets:

```
E2E_BASE_URL          # Target URL for tests (default: production)
API_BASE_URL          # API endpoint (default: production API)
E2E_TEST_EMAIL        # Test user email
E2E_TEST_PASSWORD     # Test user password
```

### Manual Trigger

You can manually run the workflow from the GitHub Actions tab with options:
- `all` - Run all tests
- `smoke` - Run only smoke tests (default)
- `critical` - Run only critical tests
- `full` - Run complete test suite

### Test Results

- **Artifacts**: Screenshots, videos, and HTML reports are saved for 7-14 days
- **Notifications**: On failure, a GitHub issue is automatically created
- **Status**: Check the Actions tab for run history and results