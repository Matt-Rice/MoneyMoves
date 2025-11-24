# Expo Token-Based Auth Setup with SecureStore

## Overview
This implementation provides secure token-based authentication for your Expo app using `expo-secure-store` and Laravel Sanctum on the backend.

## Files Created

### 1. **AuthProvider** (`lib/auth.tsx`)
- Manages global auth state (user, token, loading).
- Restores token from secure storage on app startup.
- `signIn(token, user)` — stores token securely and updates auth state.
- `signOut()` — clears token and user state.
- Exports `useAuth()` hook for use in components.

**Key features:**
- Uses `expo-secure-store` for secure token storage (platform-native encryption).
- Exposes token via context for API calls.
- Handles loading state during startup to prevent UI flashing.

### 2. **Root Layout** (`app/_layout.tsx`)
- Wraps entire app with `AuthProvider`.
- Defines Stack routes for `(tabs)` and `login`.

### 3. **Login Screen** (`app/login.tsx`)
- Email/password form.
- Calls `/api/login` endpoint on your Laravel backend.
- On success, receives token and calls `signIn(token, user)`.
- Redirects to home screen after login.

**Flow:**
1. GET `/sanctum/csrf-cookie` (prepares CSRF token, optional but recommended).
2. POST `/api/login` with credentials.
3. Backend returns `{ token, user }`.
4. Frontend stores token in SecureStore.
5. Navigate to protected area.

### 4. **Authenticated Fetch Hook** (`lib/useAuthenticatedFetch.ts`)
- Helper to make authenticated API calls.
- Automatically adds `Authorization: Bearer <token>` header.
- Handles 401 responses (token expired).

**Usage:**
```tsx
const authenticatedFetch = useAuthenticatedFetch();
const response = await authenticatedFetch('/api/user');
```

### 5. **Protected Layout** (`app/(protected)/_layout.tsx`)
- Blocks access to routes under `(protected)` if user is not authenticated.
- Shows loading spinner while restoring session.
- Redirects unauthenticated users to `/login`.

### 6. **Example Protected Screen** (`app/(protected)/index.tsx`)
- Sample screen showing how to:
  - Display logged-in user info.
  - Fetch data using `useAuthenticatedFetch()`.
  - Call `signOut()` to logout.

## Directory Structure
```
frontend/
├── app/                           # Pages only
│   ├── _layout.tsx                # Root: wraps AuthProvider
│   ├── login.tsx                  # Public login screen
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── about.tsx
│   └── (protected)/               # Auth guard at group level
│       ├── _layout.tsx            # Guards all routes in this group
│       └── index.tsx              # Example protected screen
├── lib/                           # Non-page utilities & providers
│   ├── auth.tsx                   # AuthProvider + useAuth hook
│   └── useAuthenticatedFetch.ts   # Helper for authenticated API calls
└── ...
```

## Backend Requirements (Laravel)

### 1. Login Endpoint
Must return a token (e.g., Sanctum's `createToken()`):

```php
// routes/api.php
Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    return response()->json([
        'token' => $user->createToken('auth_token')->plainTextToken,
        'user' => $user,
    ]);
});

// Middleware to verify token
Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
    return $request->user();
});
```

### 2. Sanctum Configuration
- Add `HasApiTokens` trait to your User model.
- Ensure `SANCTUM_STATEFUL_DOMAINS` includes your frontend domain if doing cookie auth.
- For token-based (native), bearer tokens work by default.

### 3. CORS & Security
- Set `CORS` to allow your frontend origin.
- Token should be short-lived; implement refresh tokens for production.

## Usage in Components

### Access Auth State
```tsx
import { useAuth } from '@/lib/auth';

export default function MyScreen() {
  const { user, token, loading, signOut } = useAuth();

  return (
    <View>
      <Text>Hello, {user?.name}</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}
```

### Make Authenticated API Calls
```tsx
import { useAuthenticatedFetch } from '@/lib/useAuthenticatedFetch';

export default function DataScreen() {
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    (async () => {
      const response = await authenticatedFetch('/api/data');
      const data = await response.json();
      // handle data
    })();
  }, []);

  return <Text>Data loaded</Text>;
}
```

## Customization

### Change API Base URL
Update `API_BASE_URL` in:
- `app/login.tsx`
- `app/hooks/useAuthenticatedFetch.ts`

Or use an environment variable:
```bash
EXPO_PUBLIC_API_URL=https://api.example.com
```

### Token Storage Key
Change `STORAGE_KEY` in `app/providers/AuthProvider.tsx` if needed.

### Add User Profile Fetch on Startup
In `AuthProvider.tsx`, uncomment the profile fetch logic to validate and fetch user data when restoring the token:

```tsx
const storedToken = await SecureStore.getItemAsync(STORAGE_KEY);
if (storedToken) {
  setToken(storedToken);
  const profile = await fetchUserProfile(storedToken);
  setUser(profile);
}
```

## Security Notes

1. **SecureStore** — Uses platform-native encryption (Keychain on iOS, EncryptedSharedPreferences on Android).
2. **Never store secrets in AsyncStorage** — it's not encrypted.
3. **HTTPS only in production** — ensure your API uses HTTPS.
4. **Token expiry** — implement short-lived tokens and refresh flows.
5. **Validate on startup** — fetch user profile to ensure token is still valid.
6. **Clear on logout** — always revoke/clear tokens server-side.

## Next Steps

- Update backend login endpoint to return tokens.
- Test the flow locally.
- Implement token refresh if using short-lived tokens.
- Add error handling and retry logic for API calls.
- Consider deep-linking behavior (redirect to intended route after login).
