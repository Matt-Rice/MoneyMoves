# Global Axios HTTP Client Setup

## Overview

A centralized axios HTTP client instance that handles:
- Automatic token injection (Bearer token from SecureStore)
- Request/response interceptors for global error handling
- 401 redirect (auto-logout on token expiry)
- Environment-based API URL configuration

## File: `lib/api.ts`

### Key Features

1. **Singleton Pattern** — Only one axios instance is created
2. **Request Interceptor** — Automatically attaches `Authorization: Bearer <token>` header
3. **Response Interceptor** — Handles global errors:
   - 401: Clears token and redirects to login
   - 403: Logs forbidden error
   - 500: Logs server error
4. **SecureStore Integration** — Retrieves token from secure storage on each request

### Initialization

Must be called in your root layout (`app/_layout.tsx`) to set up the client and optionally pass the router for 401 redirects:

```tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { createApiClient } from '../lib/api';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    createApiClient(router);
  }, [router]);

  return (
    // ... rest of layout
  );
}
```

## Usage

### In Components

```tsx
import { useApi } from '@/lib/api';

export default function MyComponent() {
  const api = useApi();

  const fetchData = async () => {
    try {
      // Token is automatically included
      const response = await api.get('/api/data');
      console.log(response.data);
    } catch (error) {
      // Error handling is global (401 redirects to login, etc.)
      if (axios.isAxiosError(error)) {
        console.error(error.response?.status, error.response?.data);
      }
    }
  };

  return <Button title="Fetch" onPress={fetchData} />;
}
```

### Common Methods

```tsx
// GET
const response = await api.get('/api/user');

// POST
const response = await api.post('/api/login', { email, password });

// PUT
const response = await api.put('/api/user', { name: 'John' });

// DELETE
const response = await api.delete('/api/data/123');

// With custom headers/options
const response = await api.get('/api/data', {
  headers: { 'X-Custom-Header': 'value' },
  timeout: 5000,
});
```

## Environment Configuration

Set the API URL via environment variable:

```bash
# .env or .env.local
EXPO_PUBLIC_API_URL=https://api.example.com
```

Or it defaults to `http://localhost:8000` for development.

## Login Flow (Updated)

```tsx
// app/login.tsx
import { useApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const api = useApi();
const { signIn } = useAuth();

// Get CSRF token (Sanctum)
await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
  withCredentials: true,
});

// Login using global client
const response = await api.post('/api/login', { email, password });
const token = response.data.token;

// Store token (AuthProvider handles the rest)
await signIn(token, response.data.user);
```

## Protected API Calls

Once authenticated, all subsequent requests automatically include the bearer token:

```tsx
// The token is automatically added by the request interceptor
const response = await api.get('/api/user');
// Equivalent to:
// GET /api/user
// Authorization: Bearer <stored_token>
```

## Error Handling

### Global (Interceptor Level)

- **401 Unauthorized** → Token deleted, redirects to `/login`
- **403 Forbidden** → Logs to console
- **500 Server Error** → Logs to console
- **Other errors** → Rejected and passed to catch block

### Component Level

```tsx
try {
  const response = await api.get('/api/data');
} catch (error) {
  if (axios.isAxiosError(error)) {
    // error.response.status, error.response.data, etc.
  }
}
```

## Advantages Over Raw Fetch

- ✅ Centralized configuration
- ✅ Automatic bearer token injection
- ✅ Consistent error handling
- ✅ Easy to add logging, retry logic, request cancellation
- ✅ Simpler API call syntax
- ✅ Type-safe with TypeScript
- ✅ Timeout handling out of the box

## Customization

### Add Request Logging

In `lib/api.ts`:
```tsx
apiClient.interceptors.request.use((config) => {
  console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});
```

### Add Retry Logic

In `lib/api.ts`:
```tsx
import axiosRetry from 'axios-retry';

axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => error.response?.status === 500,
});
```

### Custom Timeout Per Request

```tsx
const response = await api.get('/api/data', { timeout: 5000 });
```

## Migration from `useAuthenticatedFetch`

**Old:**
```tsx
const authenticatedFetch = useAuthenticatedFetch();
const response = await authenticatedFetch('/api/user');
```

**New:**
```tsx
const api = useApi();
const response = await api.get('/api/user');
```

The new approach is cleaner and centralizes all HTTP logic.
