# Social Login Technical Requirements

**Last Updated: 30-05-2024**

This document outlines the technical requirements and specifications for implementing social login functionality in the TAPPr application.

## Authentication Providers

### Google OAuth 2.0

**Required Configuration:**
- Client ID
- Client Secret
- Authorized redirect URIs:
  - `https://tappr.beer/api/auth/google/callback` (Production)
  - `http://localhost:3000/api/auth/google/callback` (Development)

**Scopes Required:**
- `openid`
- `profile`
- `email`

**User Data to Store:**
- Email address
- Display name
- Profile picture URL
- Google user ID (for account linking)

### Apple Sign In

**Required Configuration:**
- App ID
- Service ID
- Private Key
- Key ID
- Team ID
- Authorized redirect URIs:
  - `https://tappr.beer/api/auth/apple/callback` (Production)
  - `http://localhost:3000/api/auth/apple/callback` (Development)

**Scopes Required:**
- `name`
- `email`

**User Data to Store:**
- Email address
- Full name (first and last)
- Apple user ID (for account linking)

### Facebook Login

**Required Configuration:**
- App ID
- App Secret
- Authorized redirect URIs:
  - `https://tappr.beer/api/auth/facebook/callback` (Production)
  - `http://localhost:3000/api/auth/facebook/callback` (Development)

**Scopes Required:**
- `email`
- `public_profile`

**User Data to Store:**
- Email address
- Full name
- Profile picture URL
- Facebook user ID (for account linking)

## Database Schema Updates

### Users Table

```sql
ALTER TABLE users
ADD COLUMN auth_provider VARCHAR(20),
ADD COLUMN provider_user_id VARCHAR(255),
ADD COLUMN avatar_url TEXT,
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD CONSTRAINT unique_provider_user UNIQUE (auth_provider, provider_user_id);
```

### Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
```

## API Endpoints

### Authentication Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/auth/[provider]/login` | GET | Initiates OAuth flow | None |
| `/api/auth/[provider]/callback` | GET | Handles OAuth callback | None |
| `/api/auth/logout` | POST | Ends user session | Required |
| `/api/auth/session` | GET | Returns current session info | Optional |
| `/api/auth/refresh` | POST | Refreshes authentication token | Required |

### User Profile Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/users/me` | GET | Returns current user profile | Required |
| `/api/users/me` | PATCH | Updates user profile | Required |
| `/api/users/me/avatar` | PUT | Updates user avatar | Required |
| `/api/users/me/accounts` | GET | Lists linked social accounts | Required |
| `/api/users/me/accounts/[provider]` | DELETE | Unlinks a social account | Required |

## Authentication Flow

1. **Login Initiation**
   - User clicks social login button
   - Frontend redirects to `/api/auth/[provider]/login`
   - Backend generates OAuth URL and redirects user

2. **OAuth Provider Interaction**
   - User authenticates with the provider
   - Provider redirects to callback URL with authorization code

3. **Callback Processing**
   - Backend exchanges code for access token
   - Backend retrieves user profile from provider
   - Backend creates or updates user record
   - Backend generates JWT token

4. **Session Establishment**
   - Backend sets HTTP-only cookie with JWT
   - Backend redirects to frontend application
   - Frontend updates UI to reflect authenticated state

5. **Session Management**
   - Frontend checks `/api/auth/session` to verify authentication
   - Backend refreshes token as needed
   - Frontend handles session expiration gracefully

## Security Requirements

### Token Security

- JWT tokens must be signed with a strong secret
- Tokens must include expiration time (max 24 hours)
- Tokens must be stored in HTTP-only cookies
- Implement CSRF protection for authenticated requests

### Data Protection

- Encrypt sensitive user data in the database
- Implement rate limiting for authentication endpoints
- Log authentication attempts for security monitoring
- Implement account lockout after multiple failed attempts

### OAuth Security

- Store OAuth client secrets securely in environment variables
- Validate OAuth state parameter to prevent CSRF attacks
- Implement PKCE (Proof Key for Code Exchange) where supported
- Verify redirect URIs match configured values

## Frontend Components

### Login Page Components

- Social login buttons with appropriate branding
- Loading indicators during authentication
- Error message display for failed authentication
- Privacy policy and terms of service links

### User Profile Components

- Profile information display and edit forms
- Social account management interface
- Avatar upload and management
- Account linking and unlinking UI

## Mobile Integration

### iOS Requirements

- Implement Apple Sign In using `AuthenticationServices` framework
- Implement Google Sign In using Google SDK or Firebase
- Implement Facebook Login using Facebook SDK
- Handle deep linking for OAuth redirects

### Android Requirements

- Implement Google Sign In using Google Play Services
- Implement Facebook Login using Facebook SDK
- Handle deep linking for OAuth redirects
- Implement token storage in secure storage

## Testing Requirements

### Unit Tests

- Test OAuth URL generation
- Test token generation and validation
- Test user profile mapping
- Test session management functions

### Integration Tests

- Test complete authentication flow with mock providers
- Test account linking and unlinking
- Test error handling for various failure scenarios
- Test token refresh mechanism

### End-to-End Tests

- Test actual authentication with each provider
- Test user experience across different browsers
- Test mobile authentication flows
- Test performance under load

## Monitoring and Analytics

- Track authentication success/failure rates
- Monitor provider availability and response times
- Analyze provider usage distribution
- Track user retention based on authentication method

## Documentation Requirements

- API documentation for authentication endpoints
- Integration guide for frontend developers
- Mobile SDK integration documentation
- User guide for account management

## Compliance Requirements

- Implement privacy policy updates for social login
- Ensure GDPR compliance for user data handling
- Comply with provider-specific requirements
- Implement data deletion capabilities for user accounts
