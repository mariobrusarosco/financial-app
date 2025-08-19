# Backend Integration Guide

## Overview

The authentication system has been upgraded to work with your real backend API. The frontend now sends proper HTTP requests to your backend endpoints.

## API Endpoints

Your backend should implement these authentication endpoints:

### 1. Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "id": "user-id",
    "email": "user@example.com", 
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token", 
    "expiresIn": 3600
  }
}
```

### 2. Register
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

Response (201): Same as login response
```

### 3. Token Refresh
```
POST /auth/refresh
Content-Type: application/json

Request Body:
{
  "refresh_token": "jwt-refresh-token"
}

Response (200):
{
  "accessToken": "new-jwt-access-token",
  "refreshToken": "new-jwt-refresh-token", // Optional
  "expiresIn": 3600
}
```

### 4. Get Current User
```
GET /auth/me
Authorization: Bearer jwt-access-token

Response (200):
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe", 
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 5. Logout
```
POST /auth/logout
Authorization: Bearer jwt-access-token
Content-Type: application/json

Request Body:
{
  "refresh_token": "jwt-refresh-token"
}

Response (200): Empty or success message
```

### 6. Validate Session
```
GET /auth/validate
Authorization: Bearer jwt-access-token

Response (200): Empty or success message
Response (401): Unauthorized
```

## Environment Configuration

Update your `.env` file:

```bash
# Your backend API base URL
VITE_API_BASE_URL=http://localhost:8000/api
```

## JWT Token Requirements

Your backend should return JWTs with these properties:

1. **Standard JWT structure** (header.payload.signature)
2. **Expiration claim (`exp`)** in payload
3. **Issued at claim (`iat`)** in payload (recommended)
4. **User ID** in payload (recommended)

Example JWT payload:
```json
{
  "sub": "user-id",
  "exp": 1640995200,
  "iat": 1640991600,
  "email": "user@example.com"
}
```

## Error Handling

Your backend should return consistent error responses:

```json
{
  "message": "Human readable error message",
  "code": "ERROR_CODE", // Optional
  "errors": {            // Optional, for validation errors
    "email": ["Email is required"],
    "password": ["Password too short"]
  }
}
```

## Frontend Features

The frontend automatically handles:

✅ **Token Management**
- Automatic Authorization header injection
- Secure token storage (localStorage/sessionStorage)
- Token expiration checking

✅ **Automatic Token Refresh**
- Detects 401 errors
- Refreshes tokens automatically
- Retries failed requests
- Queues requests during refresh

✅ **Error Handling**
- Maps backend errors to user messages
- Handles network failures
- Redirects on authentication failures

✅ **Form Validation**
- Client-side validation
- Server error display
- Loading states

## Testing the Integration

1. **Start your backend** on `http://localhost:8000`
2. **Start the frontend** with `yarn dev`
3. **Navigate to** `http://localhost:2000/login`
4. **Test authentication flow**:
   - Login with valid credentials
   - Try invalid credentials
   - Test automatic logout on token expiry
   - Test token refresh (simulate with network throttling)

## CORS Configuration

Make sure your backend allows requests from the frontend:

```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:2000', 'http://localhost:5173'],
  credentials: true
}));
```

## Troubleshooting

### Common Issues:

1. **CORS errors**: Check backend CORS configuration
2. **401 on /auth/me**: Check JWT token format and expiration
3. **Infinite refresh loops**: Verify refresh token endpoint
4. **Network errors**: Check backend URL in .env file

### Debug Mode:

Enable console logs by opening browser dev tools. The frontend logs:
- Login/signup attempts
- Token refresh attempts
- API errors
- Session validation

## Security Considerations

✅ **Implemented:**
- Secure token storage
- Automatic token refresh
- Request retry logic
- CSRF protection ready

🔧 **Backend should implement:**
- Rate limiting on auth endpoints
- Strong password requirements
- Account lockout protection
- Refresh token rotation
- Secure JWT signing

## Migration from Mock

The system seamlessly switches from mock to real backend. No frontend code changes needed beyond environment configuration.

Mock data is kept for development/testing purposes and doesn't interfere with production usage.