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
      provider?: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    password?: string;
    authType?: string;
    sessionCookie?: string | null;
    provider?: string;
    accessToken?: string;
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
          console.log('Authorize - Starting form-based auth with credentials:', {
            email: credentials.email,
            name: credentials.name,
            provider: 'form'
          });

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

          const data = await response.json();
          console.log('Authorize - API Response:', data);

          if (!response.ok) {
            console.log('Authorize - API request failed:', response.status);
            return null;
          }

          // Extract user data from the API response
          const userData = data.user || data;
          console.log('Authorize - Extracted user data:', userData);
          
          // Extract email from the id_token if not present in userData
          let email = userData.email;
          if (!email && response.headers.get('set-cookie')) {
            const idToken = response.headers.get('set-cookie')?.split('id_token=')[1]?.split(';')[0];
            if (idToken) {
              try {
                const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
                email = decodedToken.email;
              } catch (e) {
                console.error('Failed to decode id_token:', e);
              }
            }
          }
          
          const user = {
            id: userData.id || userData._id || userData.sub || email,
            email: email || userData.email,
            name: userData.name || credentials.name,
            provider: 'form',
            authType: userData.authType || 'existing',
            accessToken: userData.accessToken || response.headers.get('set-cookie')?.split('access_token=')[1]?.split(';')[0],
            sessionCookie: response.headers.get('set-cookie')
          };
          
          console.log('Authorize - Returning user object:', user);
          return user;
        } catch (error) {
          console.error('Authorize - Credentials auth error:', error);
          return null;
        }
      }
    })
  ],
  secret: config.NEXTAUTH_SECRET,
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
      console.log('Session Callback - Input:', { session, token });
      
      if (session.user) {
        // Map all fields from token to session
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.password = token.password;
        session.user.authType = token.authType;
        session.user.provider = token.provider;
        session.user.accessToken = token.accessToken;
        session.user.sessionCookie = token.sessionCookie;
      }
      
      console.log('Session Callback - Updated session:', session);
      return session;
    },

    async jwt({ token, user, account }: { token: any; user?: User; account?: Account | null }) {
      console.log('JWT Callback - Input:', { token, user, account });
      
      if (user) {
        // Initial sign in - store all user fields in the token
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.password = user.password;
        token.authType = user.authType;
        token.provider = account?.provider || user.provider;
        token.accessToken = user.accessToken;
        token.sessionCookie = user.sessionCookie;
      } else if (token) {
        // Subsequent requests - preserve existing token data
        const existingToken = { ...token };
        return existingToken;
      }
      
      console.log('JWT Callback - Updated token:', token);
      return token;
    }
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: "jwt" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
