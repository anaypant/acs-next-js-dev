'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, signIn, signOut, getSession, getIdTokenPayload } from '@/lib/cognito';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface SignUpParams {
  username: string;
  password: string;
  options?: {
    userAttributes?: {
      email?: string;
    };
    autoSignIn?: boolean;
  };
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await getSession();
      if (session) {
        const cognitoUser = getCurrentUser();
        if (cognitoUser) {
          const payload = getIdTokenPayload(session);
          const user: User = {
            id: payload.sub,
            username: cognitoUser.getUsername(),
            email: payload.email || '',
            attributes: {
              sub: payload.sub,
              email: payload.email || '',
              name: payload.name || cognitoUser.getUsername()
            }
          };
          setAuthState({ user, isLoading: false, error: null });
          return;
        }
      }
      setAuthState({ user: null, isLoading: false, error: null });
    } catch (error) {
      setAuthState({ user: null, isLoading: false, error: null });
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await signIn(username, password);
      await checkAuth();
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as Error).message }));
      throw error;
    }
  };

  const signUp = async (username: string, password: string, email: string): Promise<void> => {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: { email }
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as Error).message }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      signOut();
      setAuthState({ user: null, isLoading: false, error: null });
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as Error).message }));
    }
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    signUp,
    logout
  };
} 