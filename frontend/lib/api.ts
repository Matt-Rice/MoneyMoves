import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://127.0.0.1:8000';
const STORAGE_KEY = 'authToken';
let apiClient: AxiosInstance | null = null;
let routerRef: any = null;

// Note: Hooks (useRouter/useEffect) must not be used at module scope.
// Call `createApiClient(router)` from a React component (for example in a layout)
// to provide a router for redirects. If you don't need router redirects,
// calling createApiClient() without arguments is fine.

// Initialize axios client
export function createApiClient(router?: any): AxiosInstance {
  if (apiClient) return apiClient;

  if (router) routerRef = router;

  apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: attach token to all requests
  apiClient.interceptors.request.use(
    async (config: any) => {
      try {
        const token = await SecureStore.getItemAsync(STORAGE_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to retrieve token from SecureStore', error);
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  // Response interceptor: handle errors globally
  apiClient.interceptors.response.use(
    (response: any) => response,
    async (error: AxiosError) => {
      // Handle 401 Unauthorized - token expired or invalid
      // Only redirect if user is already authenticated (has a stored token)
      // This avoids redirecting during login when credentials are invalid
      if (error.response?.status === 401) {
        try {
          const storedToken = await SecureStore.getItemAsync(STORAGE_KEY);
          if (storedToken) {
            // User was logged in but token is now invalid - clear and redirect
            await SecureStore.deleteItemAsync(STORAGE_KEY);
            console.warn('Token invalidated, user should re-login');
            if (routerRef) {
              routerRef.replace('/login');
            }
          }
          // If no stored token, let the component handle the 401 (e.g., login failed)
        } catch (e) {
          console.error('Failed to clear token', e);
        }
      }

      // Handle other errors
      if (error.response?.status === 403) {
        console.error('Forbidden: you do not have access to this resource');
      }

      if (error.response?.status === 500) {
        console.error('Server error: something went wrong on the backend');
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
}

// Get the existing client (must be initialized first)
export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    throw new Error('API client not initialized. Call createApiClient first.');
  }
  return apiClient;
}

// Convenience hook for components
export function useApi() {

  if (!apiClient) {
    createApiClient();
  }
  return apiClient as AxiosInstance;
}

// Optional initializer for components that have access to a router instance.
// Example usage in a layout component:
// const router = useRouter(); useEffect(() => { initApi(router); }, [router]);
export function initApi(router?: any) {
  createApiClient(router);
}
