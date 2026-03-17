Sentry Integration Guide

## Overview

Sentry is now fully integrated into Better Call Buffet for comprehensive error tracking, performance monitoring, and user experience insights.

## Configuration

### Environment Variables

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
VITE_ENVIRONMENT=development  # or production
VITE_APP_VERSION=0.0.2
VITE_SENTRY_DEBUG=false       # Enable for debugging Sentry itself
```

### Features Enabled

✅ **Error Tracking**

- Automatic error capture and reporting
- Custom error context and tags
- Error fingerprinting for grouping

✅ **Performance Monitoring**

- Transaction tracking
- API call monitoring
- React component render tracking
- Router navigation tracing

✅ **Release Tracking**

- Track errors across different releases
- Monitor error rate changes after deployments

## Integration Points

### 1. Error Handler Integration

The existing error handler (`/src/domains/global/utils/error-handler.ts`) now automatically reports:

- **HIGH** and **CRITICAL** severity errors to Sentry
- Contextual information (category, user message, technical details)
- Error fingerprinting for better grouping
- Custom tags for filtering and analysis

```typescript
// Example: API error automatically reported
const apiError = new ApiError('Authentication failed', 401);
handleErrorWithToast(apiError); // Reports to Sentry + shows toast
```

### 2. Error Boundary

React Error Boundary wraps the entire app to catch unhandled errors:

- Displays user-friendly error page
- Reports full error details to Sentry
- Offers reload option for recovery

## Error Categories & Severity

### Categories

- `NETWORK` - Connection and API issues
- `VALIDATION` - Form and input validation
- `AUTHENTICATION` - Login and auth issues
- `AUTHORIZATION` - Permission errors
- `SERVER` - Backend server errors
- `UNKNOWN` - Unclassified errors

### Severity Levels

- `LOW` - Minor issues, app still functional
- `MEDIUM` - Important but not critical
- `HIGH` - Critical errors affecting core functionality
- `CRITICAL` - Data integrity or security issues

## Production Considerations

### Performance Impact

- **Development**: Full tracing enabled
- **Production**: 10% transaction sampling for optimal performance

### Privacy & Security

- Sensitive headers filtered out
- No PII captured automatically

### Error Filtering

- Development errors filtered out in production
- Network errors filtered to reduce noise
- React DevTools errors filtered out
- Known non-critical errors ignored

## Monitoring & Alerts

### Recommended Sentry Alerts

1. **High Error Rate**
   - Trigger: >10 errors in 5 minutes
   - Action: Notify dev team

2. **Critical Errors**
   - Trigger: Any error with `fatal` level
   - Action: Immediate notification

3. **Authentication Failures**
   - Trigger: >5 auth errors in 1 minute
   - Action: Security team notification

4. **Performance Degradation**
   - Trigger: Average response time >2 seconds
   - Action: Performance team notification

### Dashboard Widgets

Useful Sentry dashboard widgets:

- Error frequency by category
- User impact (unique users affected)
- Browser and device breakdown
- Top error messages
- Performance metrics by page

## Troubleshooting

### Common Issues

1. **"Sentry DSN not found"**
   - Check `.env` file has correct `VITE_SENTRY_DSN`
   - Ensure DSN format is correct
   - Verify environment variable is loaded

2. **No errors showing in Sentry**
   - Check console for Sentry initialization message
   - Trigger a test error manually in the app
   - Verify project ID in DSN matches Sentry project

3. **Too many events**
   - Adjust sampling rates in `/src/config/sentry.ts`
   - Add more filters in `beforeSend` function
   - Review error categories and severities

### Debug Mode

Enable debug mode for troubleshooting:

```bash
VITE_SENTRY_DEBUG=true
```

This will:

- Show Sentry events in development
- Log Sentry initialization details
- Display transaction and error details

## Development Workflow

### Error Handling Best Practices

1. **Use existing error handler**: `handleErrorWithToast(error, context)`
2. **Add meaningful context**: Category, severity, user message
3. **Test error scenarios**: Test manually through normal app usage
4. **Monitor regularly**: Check Sentry dashboard for new issues

### Release Management

1. **Tag releases**: Update `VITE_APP_VERSION` for each release
2. **Monitor post-deploy**: Watch for error rate spikes
3. **Set up alerts**: Get notified of critical issues
4. **Review weekly**: Analyze error trends and user impact

Sentry is now ready to help you maintain a high-quality user experience! 🚀
