import NextAuth from "next-auth/next";
import type { NextAuthConfig } from "next-auth/next";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { config } from '@/lib/local-api-config';
import { Credentials as CredentialsType, SignupProvider } from "@/app/types/auth";
import { Account } from "next-auth";
import { User } from "next-auth";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        provider: { label: "Provider", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const creds: CredentialsType = {
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
            provider: (credentials.provider || 'form') as SignupProvider
          };

          console.log('Authorize - Starting form-based auth with credentials:', creds);

          const response = await fetch(`${config.API_URL}/users/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds),
          });

          const data = await response.json();
          console.log('Authorize - API Response:', data);

          if (!response.ok) {
            throw new Error(data.error || 'Authentication failed');
          }

          const user = {
            id: data.user?.id || data.userId || creds.email,
            email: creds.email,
            name: data.user?.name || data.name || creds.name || '',
            provider: creds.provider,
            authType: data.authType,
            ...(creds.provider === 'google' && { accessToken: data.accessToken })
          };

          console.log('Authorize - Returning user object:', user);
          return user;
        } catch (error) {
          console.error('Authorize - Error:', error);
          return null;
        }
      }
    }),

    Google({
      clientId: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
    })
  ],

  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider === "google") {
        // Store the access token
        user.accessToken = account.access_token;
        user.provider = 'google';

        // Check if this is a new user from Google's perspective
        if (!account.isNewUser) {
          // call api/auth/login, pass in email, password, provider
          const loginData = {
            email: user.email,
            password: "",
            provider: 'google',
            name: user.name
          };

          const loginResponse = await fetch(config.NEXTAUTH_URL + `/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
          });

          const loginResponseData = await loginResponse.json();
          console.log('Login response data:', loginResponseData);
          
          // Handle Set-Cookie header from login response
          const setCookieHeader = loginResponse.headers.get('Set-Cookie');
          if (setCookieHeader) {
            user.sessionCookie = setCookieHeader;
          }
          
          // Store the user data in the token for session creation
          if (loginResponseData.success) {
            // Set authType in the token
            user.authType = 'existing';
            return true;
          }
          return false;
        }


        try {
          // Split the name into firstName and lastName
          const [firstName, ...lastNameParts] = user.name?.split(' ') || ['', ''];
          const lastName = lastNameParts.join(' ') || firstName;

          const signupData = {
            firstName,
            lastName,
            email: user.email,
            provider: 'google',
            captchaToken: '' // this is empty because we don't need it for google signup
          };

          const res = await fetch(
            `${config.NEXTAUTH_URL}/api/auth/signup`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(signupData) }
          );
          const data = await res.json();
          console.log('Google signup response data:', data);

          // Handle Set-Cookie header from signup response
          const setCookieHeader = res.headers.get('Set-Cookie');
          if (setCookieHeader) {
            user.sessionCookie = setCookieHeader;
          }

          // allow if already exists
          if (!res.ok && res.status !== 409) {
            console.error('Signup error:', data.error);
            return false;
          }
          // Set authType in the token
          user.authType = 'new';
          return true;
        } catch (err) {
          console.error('NextAuth Google signup error:', err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      console.log('JWT Callback - Input:', { token, user, account });

      if (user) {
        const mappedToken = {
          ...token,
          email: user.email,
          name: user.name,
          provider: user.provider || 'form',
          authType: user.authType || 'credentials',
          accessToken: account?.access_token || user.accessToken || undefined,
        };

        console.log('JWT Callback - Updated token:', mappedToken);
        return mappedToken;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log('Session Callback - Input:', { session, token });

      // Map token fields to session user
      const mappedUser = {
        ...session.user,
        email: token.email,
        name: token.name ?? '',
        provider: token.provider || 'form',
        authType: token.authType || 'credentials',
        accessToken: token.accessToken,
      };

      const updatedSession = {
        ...session,
        user: mappedUser
      };

      console.log('Session Callback - Updated session:', updatedSession);
      return updatedSession;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/error',
    verifyRequest: '/verify-email',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
