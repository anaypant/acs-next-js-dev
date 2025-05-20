import NextAuth, { type DefaultSession, type NextAuthOptions, type User, type Account, type Profile } from "next-auth";
import Google from "next-auth/providers/google";
import { config } from '@/lib/config';

// Extend session and user types to include password
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      password?: string;
    } & DefaultSession["user"];
  }

  interface User {
    password?: string;
  }
}

// Generate a secure password that meets requirements
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
    })
  ],
  secret: config.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider === "google") {
        // generate a password for the new user
        user.password = generateSecurePassword();

        try {
          const signupData = {
            name: user.name,
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
          // allow if already exists
          if (!res.ok && res.status !== 409) {
            console.error('Signup error:', data.error);
            return false;
          }
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
      }
      return session;
    },

    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token.id = user.id;
        token.password = user.password;
      }
      return token;
    }
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: "jwt" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
