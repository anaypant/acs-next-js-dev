import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    provider?: string;
    authType?: string;
    accessToken?: string;
  }

  interface Session {
    user: User;
  }
} 