# Social Login Implementation Roadmap

**Last Updated: 30-05-2024**

This document outlines the implementation plan for adding social login capabilities to the TAPPr application, allowing users to authenticate using their existing accounts from popular social platforms.

## Overview

Social login will provide a seamless authentication experience for TAPPr users, eliminating the need to create and remember another set of credentials. This feature will be implemented for both the mobile app and the public review system on the website.

## Supported Platforms

The initial implementation will support the following authentication providers:

1. **Google** - Wide adoption across demographics
2. **Apple** - Required for iOS apps and popular among Apple users
3. **Facebook** - Large user base with social sharing capabilities

## Implementation Phases

### Phase 1: Infrastructure Setup

- [ ] Set up authentication service in Supabase
- [ ] Configure OAuth applications in each provider's developer console
  - [ ] Google Cloud Console
  - [ ] Apple Developer Portal
  - [ ] Facebook for Developers
- [ ] Store OAuth credentials securely in environment variables
- [ ] Create database schema updates to support social login
  - [ ] Add `auth_provider` field to users table
  - [ ] Add `provider_user_id` field to users table
  - [ ] Add necessary indexes for efficient queries

### Phase 2: Backend Implementation

- [ ] Create authentication API endpoints
  - [ ] `/api/auth/[provider]/login` - Initiates the OAuth flow
  - [ ] `/api/auth/[provider]/callback` - Handles OAuth callback
  - [ ] `/api/auth/logout` - Ends the user session
- [ ] Implement JWT token generation and validation
- [ ] Create user profile synchronization logic
  - [ ] Fetch user profile data from providers
  - [ ] Map provider data to TAPPr user profile
  - [ ] Handle profile picture imports
- [ ] Implement session management
  - [ ] Secure cookie handling
  - [ ] Token refresh mechanism
  - [ ] Session expiration

### Phase 3: Frontend Implementation

- [ ] Design login UI with social buttons
  - [ ] Create consistent button styling across platforms
  - [ ] Implement loading states during authentication
  - [ ] Design error handling UI
- [ ] Implement authentication flow in React components
  - [ ] OAuth redirect handling
  - [ ] Token storage in secure context
  - [ ] Authenticated state management
- [ ] Create protected routes and components
  - [ ] Implement route guards for authenticated content
  - [ ] Add user profile dropdown in navigation
  - [ ] Create account settings page

### Phase 4: Mobile App Integration

- [ ] Implement native social login for iOS
  - [ ] Configure Apple Sign In
  - [ ] Implement Google Sign In via Firebase
  - [ ] Add Facebook SDK
- [ ] Implement native social login for Android
  - [ ] Configure Google Sign In
  - [ ] Add Facebook SDK
- [ ] Synchronize authentication state between app and API
  - [ ] Implement secure token storage
  - [ ] Create background token refresh

### Phase 5: Public Review Integration

- [ ] Update public review form to support authenticated users
  - [ ] Add social login options to review form
  - [ ] Pre-fill reviewer information for logged-in users
  - [ ] Allow users to manage their reviews
- [ ] Implement review ownership and management
  - [ ] Associate reviews with user accounts
  - [ ] Allow users to edit/delete their own reviews
  - [ ] Add review history to user profiles

## Technical Implementation Details

### Database Schema Updates

```sql
-- Add authentication fields to users table
ALTER TABLE users 
ADD COLUMN auth_provider VARCHAR(20),
ADD COLUMN provider_user_id VARCHAR(255),
ADD COLUMN avatar_url TEXT,
ADD CONSTRAINT unique_provider_user UNIQUE (auth_provider, provider_user_id);

-- Create sessions table for managing user sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Environment Variables

Add the following environment variables to the application:

```
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=86400 # 24 hours in seconds
```

### API Endpoints

#### Social Login Initiation

```typescript
// src/app/api/auth/[provider]/login/route.ts
import { NextResponse } from 'next/server';
import { getOAuthURL } from '@/lib/auth/oauth';

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider;
    const redirectURL = getOAuthURL(provider);
    
    return NextResponse.redirect(redirectURL);
  } catch (error) {
    console.error(`Error initiating ${params.provider} login:`, error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
```

#### OAuth Callback Handling

```typescript
// src/app/api/auth/[provider]/callback/route.ts
import { NextResponse } from 'next/server';
import { handleOAuthCallback, generateToken } from '@/lib/auth/oauth';

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code missing' },
        { status: 400 }
      );
    }
    
    const userData = await handleOAuthCallback(params.provider, code);
    const token = generateToken(userData);
    
    // Set secure HTTP-only cookie with the token
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return response;
  } catch (error) {
    console.error(`Error handling ${params.provider} callback:`, error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
```

## Security Considerations

1. **Token Security**
   - Use HTTP-only cookies for storing authentication tokens
   - Implement CSRF protection for authenticated requests
   - Set appropriate cookie security flags (Secure, SameSite)

2. **Data Protection**
   - Limit the scope of OAuth permissions to essential data
   - Store only necessary user information from providers
   - Implement proper data encryption for sensitive information

3. **Account Linking**
   - Develop a strategy for linking multiple social accounts to one TAPPr account
   - Handle potential conflicts with existing email addresses
   - Provide account recovery options

## User Experience Guidelines

1. **Login Flow**
   - Keep the authentication process simple and intuitive
   - Provide clear error messages for authentication failures
   - Offer fallback options if social login fails

2. **User Profile**
   - Allow users to customize imported profile information
   - Provide options to disconnect social accounts
   - Respect user privacy preferences

3. **Permissions**
   - Clearly communicate what data will be accessed from social accounts
   - Request minimal permissions required for functionality
   - Allow users to manage permissions after authentication

## Testing Plan

1. **Unit Tests**
   - Test OAuth URL generation
   - Test token generation and validation
   - Test user profile mapping

2. **Integration Tests**
   - Test complete authentication flow with mock OAuth providers
   - Test session management and expiration
   - Test error handling scenarios

3. **End-to-End Tests**
   - Test actual authentication with each provider
   - Test user experience across different devices
   - Test performance under load

## Rollout Strategy

1. **Alpha Testing**
   - Internal testing with development team
   - Focus on technical implementation and security

2. **Beta Testing**
   - Limited user testing with selected users
   - Gather feedback on user experience

3. **Phased Rollout**
   - Release Google authentication first
   - Add Apple authentication for iOS app release
   - Add Facebook authentication last

## Success Metrics

1. **Adoption Rate**
   - Percentage of users choosing social login vs. traditional login
   - Distribution across different providers

2. **Conversion Impact**
   - Change in sign-up completion rate
   - Reduction in abandoned sign-ups

3. **User Satisfaction**
   - Feedback on authentication experience
   - Reduction in authentication-related support requests

## Documentation Updates

- [ ] Update API documentation with authentication endpoints
- [ ] Create user guide for social login features
- [ ] Document security practices for authentication

## Related Documentation

- [API Security Best Practices](../security/api-key-security.md)
- [User Authentication Flow](./user-authentication.md)
- [Mobile App Integration](./mobile-app-integration.md)
