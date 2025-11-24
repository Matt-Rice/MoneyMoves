import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from './api';
import * as SecureStore from 'expo-secure-store';
import axios, { AxiosError } from 'axios';

const STORAGE_KEY = 'authToken';
const API_BASE_URL = 'http://127.0.0.1:8000';

export type User = {
  id: string;
  email?: string;
  name?: string;
} | null;

export type AuthContextValue = {
  user: User;
  token: string | null;
  loading: boolean;
  signIn: (token: string, user?: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore token and user from secure storage on app startup
  useEffect(() => {
    (async () => {
      try {
        const api = useApi(); // Call inside effect, after client is initialized
        const storedToken = await SecureStore.getItemAsync(STORAGE_KEY);
        if (storedToken) {
          setToken(storedToken);
          //Get user profile
          const user: User = (await api.get('/api/me')).data;
             
          // If user is not found
          if (!user || !user.id){
            console.warn('No user found for stored token, signing out');
            await SecureStore.deleteItemAsync(STORAGE_KEY);
            setToken(null);
            setUser(null);
          }
          else{
            setUser({ id: user?.id, email: user?.email });
          }
        }

      } catch (e) {
        if (axios.isAxiosError(e)) {
            console.error('API error while restoring user', e.response?.data);
        }
        console.warn('Failed to restore token from SecureStore', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

    const signIn = async (newToken: string, newUser?: User) => {
    try {
        const api = useApi();
        await SecureStore.setItemAsync(STORAGE_KEY, newToken);
        setToken(newToken);

        if (newUser && newUser.id) {
        setUser(newUser);
        } else {

        try {
            const resp = await api.get('/api/me');
            const profile = resp.data;
            if (profile?.id) {
            setUser({ id: String(profile.id), email: profile.email, name: profile.name });
            } else {
            // unexpected: clear token and throw
            await SecureStore.deleteItemAsync(STORAGE_KEY);
            setToken(null);
            throw new Error('Login did not return a valid user profile.');
            }
        } catch (err) {
            // if fetching profile fails, clear stored token and rethrow so caller can show an error
            await SecureStore.deleteItemAsync(STORAGE_KEY);
            setToken(null);
            throw err;
        }
        }
    } catch (e) {
        console.error('Failed to store token in SecureStore', e);
        throw e;
    }
    };

  const signOut = async () => {
    try {
      // Clear token from secure storage
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Failed to delete token from SecureStore', e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
