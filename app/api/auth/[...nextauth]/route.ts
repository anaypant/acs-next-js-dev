import NextAuth, { type DefaultSession, type NextAuthOptions, type User, type Account, type Profile } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { config } from '@/lib/local-api-config';
import { cookies } from 'next/headers';

// Extend session and user types to include password
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      password?: string;
      authType?: string;
      sessionCookie?: string;
    } & DefaultSession["user"];
  }

  interface User {
    password?: string;
    authType?: string;
    sessionCookie?: string;
  }
}

// Generate a secure password that meets requirements for google signup
const generateSecurePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*(),.?":{}|<>';
  const all = uppercase + numbers + special;
  let pw = uppercase[Math.floor(Math.random() * uppercase.length)];
  pw += numbers[Math.floor(Math.random() * numbers.length)];
  pw += special[Math.floor(Math.random() * special.length)];
  for (let i = 0; i < 5; i++) pw += all[Math.floor(Math.random() * all.length)];
  return pw.split('').sort(() => Math.random() - 0.5).join('');
};

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } }
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(config.API_URL + `/users/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              provider: 'form',
              name: credentials.name
            }),
          });

          const user = await response.json();

          if (!response.ok) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Credentials auth error:', error);
          return null;
        }
      }
    })
  ],
  secret: config.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider === "google") {
        // Check if this is a new user from Google's perspective
        if (!account.isNewUser) {
          // call api/auth/login, pass in email, password, provider
          const loginData = {
            email: user.email,
            password: user.password || "",
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

        // generate a password for the new user
        user.password = generateSecurePassword();

        try {
          // Split the name into firstName and lastName
          const [firstName, ...lastNameParts] = user.name?.split(' ') || ['', ''];
          const lastName = lastNameParts.join(' ') || firstName;

          const signupData = {
            firstName,
            lastName,
            email: user.email,
            password: user.password,
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

    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.password = token.password;
        session.user.authType = token.authType;
        session.user.provider = token.provider;
      }
      // Add the session cookie value to the session if present in the token
      if (token.sessionCookie) {
        session.sessionCookie = token.sessionCookie;
      }
      return session;
    },

    async jwt({ token, user, account }: { token: any; user?: User; account?: Account | null }) {
      if (user) {
        token.id = user.id;
        token.password = user.password;
        token.authType = user.authType;
        token.provider = account?.provider;
        // If you have the Set-Cookie header from your API, add it to the token
        if (user.sessionCookie) {
          token.sessionCookie = user.sessionCookie;
        }
      }
      return token;
    }
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: "jwt" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
