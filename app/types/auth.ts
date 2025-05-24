// types/auth.ts

import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

export type SignupProvider = 'google' | 'form';

// Extend the built-in types with our custom fields
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User
  }
  
  interface User extends DefaultUser {
    email: string;
    name: string;
    authType: 'new' | 'existing';
    provider: SignupProvider;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  // Instead of extending CustomJWT directly, merge the properties
  interface JWT {
    authType: 'new' | 'existing';
    provider: SignupProvider;
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
        userId: string;
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