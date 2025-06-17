// types/auth.ts

import "next-auth"
import type { JWT } from "next-auth/jwt"

export type SignupProvider = 'google' | 'form';

// Extend the built-in types with our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      authType: 'new' | 'existing';
      provider: SignupProvider;
      accessToken?: string;
    };
    sessionId?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    authType: 'new' | 'existing';
    provider: SignupProvider;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    authType: 'new' | 'existing';
    provider: SignupProvider;
    accessToken?: string;
  }
}

// This is the key part - we're extending the default session type
declare module "next-auth/react" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      authType: 'new' | 'existing';
      provider: SignupProvider;
      accessToken?: string;
    };
    sessionId?: string;
  }
}

export interface AuthContextType {
    user: import("next-auth").User | null;
    isLoading: boolean;
    login: () => void; // Function to initiate login redirect
    logout: () => Promise<void>; // Function to call logout API endpoint
    // Add other context values if needed (e.g., tokens, specific roles)
}

export interface SignupData {
    name: string;
    email: string;
    password?: string;
    provider: SignupProvider;
    captchaToken: string;
}

export interface SignupResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        email: string;
        name: string;
    };
    error?: string;
}

// API Response types
export interface AuthResponse {
    success: boolean;
    message: string;
    user?: import("next-auth").User;
    error?: string;
}

// Credentials type for NextAuth
export interface Credentials {
    email: string;
    password: string;
    name?: string;
    provider: SignupProvider;
}