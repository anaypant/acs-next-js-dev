import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"
import { SignupProvider } from "./app/types/auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      authType: string
      provider: SignupProvider
      accessToken?: string
      sessionCookie?: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    authType: 'new' | 'existing'
    provider: SignupProvider
    accessToken?: string
    sessionCookie?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    authType: 'new' | 'existing'
    provider: SignupProvider
    accessToken?: string
    sessionCookie?: string | null
  }
} 