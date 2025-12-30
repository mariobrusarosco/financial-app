# User Journey: Authentication

## Overview
Users need to authenticate to access the Better Call Buffet financial management application. This journey covers both new user registration and returning user login.

## Journey Flow

### 1. Initial Access
- **Entry Point:** User navigates to `https://better-call-buffet.mariobrusarosco.com/login`
- **Page Elements:**
  - Application logo
  - "Better Call Buffet" heading
  - "Personal finances management" subtitle
  - Login form with Email and Password fields
  - "Remember me" checkbox
  - Demo credentials displayed on page:
    - Email: `user@example.com`
    - Password: `password123`
  - "Sign in" button
  - Link to "Sign up" page

### 2. Login Process

#### Step 2.1: Enter Credentials
- User fills in email address in the "Email" textbox (placeholder: `user@example.com`)
- User enters password in the "Password" textbox (placeholder: `Enter your password`)
- Optional: User checks "Remember me" checkbox to persist session in localStorage instead of sessionStorage

#### Step 2.2: Submit Login
- User clicks "Sign in" button
- Button state changes to "Signing in..." (disabled state with loading indicator)
- Form fields become disabled during submission

#### Step 2.3: Authentication Response
- **Success Path:**
  - User is redirected to `/dashboard?from=2025-12-01&to=2025-12-31`
  - Welcome toast notification appears: "Welcome back, [User Name]!"
  - User sees the main dashboard with navigation menu

- **Error Path:**
  - User remains on login page
  - Error toast notification appears (e.g., "Session expired. Please login again.")
  - Form fields become enabled again
  - User can retry login

### 3. Sign Up Alternative
- User clicks "Sign up" link
- Navigates to `/signup` page
- (Sign up flow to be documented separately if implemented)

## Technical Details

### Authentication Storage
- **With "Remember me" checked:** Tokens stored in `localStorage`
- **Without "Remember me":** Tokens stored in `sessionStorage`
- Storage keys:
  - `auth_access_token`
  - `auth_refresh_token`
  - `auth_user`
  - `auth_remember_me`

### Session Management
- After successful login, user session is maintained via JWT tokens
- Access token used for API authentication
- Refresh token used for token renewal

## User Experience Considerations
- Clear demo credentials displayed for testing
- Loading states provide feedback during authentication
- Toast notifications confirm successful login
- Automatic redirect to dashboard upon success
- Error messages guide user on failed attempts

## Related Features
- Dashboard access (requires authentication)
- All financial management features (protected routes)

