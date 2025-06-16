import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { config } from '@/lib/local-api-config';
import { User } from "next-auth";

export type SignupProvider = 'form' | 'google';

export interface Credentials {
  email: string;
  password: string;
  name?: string;
  provider: SignupProvider;
}

export interface SignupData extends Credentials {
  captchaToken?: string;
  firstName?: string;
  lastName?: string;
}

export const authOptions = {
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
          const creds: Credentials = {
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
            provider: (credentials.provider || 'form') as SignupProvider
          };

          const response = await fetch(`${config.API_URL}/users/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Authentication failed');
          }

          const user: User = {
            id: data.user?.id || data.id || '',
            email: creds.email,
            name: data.user?.name || data.name || creds.name || '',
            provider: creds.provider,
            authType: data.authType || data.user?.authType || 'existing',
          };
          
          if (creds.provider === 'google' && data.accessToken) {
            user.accessToken = data.accessToken;
          }

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
    async signIn({ user, account }: { user: User, account: any | null }) {
      if (account?.provider === "google") {
        user.provider = 'google';
        if (account.access_token) {
            user.accessToken = account.access_token;
        }

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
          
          // Handle Set-Cookie header from login response
          const setCookieHeader = loginResponse.headers.get('set-cookie');
          if (setCookieHeader) {
            let cookie = setCookieHeader;
            if (process.env.NODE_ENV !== 'production') {
              // Remove Secure attribute for local development
              cookie = cookie.replace(/; ?secure/gi, '');
            }
            user.sessionCookie = cookie;
          } else {
            throw new Error('No session_id cookie found in login response headers');
          }
          
          // Store the user data in the token for session creation
          if (loginResponseData.success) {
            // Set authType from the login response
            user.authType = loginResponseData.user?.authType || loginResponseData.authType || 'existing';
            user.id = loginResponseData.user.id;
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

          // Handle Set-Cookie header from signup response
          const setCookieHeader = res.headers.get('set-cookie');
          if (setCookieHeader) {
            let cookie = setCookieHeader;
            if (process.env.NODE_ENV !== 'production') {
              // Remove Secure attribute for local development
              cookie = cookie.replace(/; ?secure/gi, '');
            }
            user.sessionCookie = cookie;
          } else {
            throw new Error('No session_id cookie found in signup response headers');
          }

          // allow if already exists
          if (!res.ok && res.status !== 409) {
            console.error('Signup error:', data.error);
            return false;
          }

          // Get authType from the signup response
          if (data.success && data.data?.session?.user?.authType) {
            user.authType = data.data.session.user.authType;
          } else {
            // Fallback to 'new' for new Google signups
            user.authType = 'new';
          }
          return true;
        } catch (err) {
          console.error('NextAuth Google signup error:', err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: { token: JWT, user: User, account: any | null }) {
        if (account) {
            token.accessToken = account.access_token;
        }
        if (user) {
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.provider = user.provider;
            token.authType = user.authType;
            if ((user as any).sessionCookie) {
                token.sessionCookie = (user as any).sessionCookie;
            }
        }
        return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
        if (session.user) {
            session.user.id = token.id;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
            session.user.provider = token.provider;
            session.user.authType = token.authType;
            // Do not expose accessToken to the client-side
        }
        if ((token as any).sessionCookie) {
            session.sessionCookie = (token as any).sessionCookie;
        }
        return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/error',
    verifyRequest: '/verify-email',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 