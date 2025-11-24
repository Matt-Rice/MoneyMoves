import { useAuth } from './auth';

const API_BASE_URL = 'http://localhost:8000'; // Update with your backend URL

export function useAuthenticatedFetch() {
  const { token } = useAuth();

  const authenticatedFetch = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header with token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized (token expired/invalid)
    if (response.status === 401) {
      console.warn('Token invalid or expired, user should re-login');
      // You can dispatch a logout action here or use a router hook to redirect
      throw new Error('Unauthorized - please login again');
    }

    return response;
  };

  return authenticatedFetch;
}
