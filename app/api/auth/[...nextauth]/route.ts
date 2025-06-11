import NextAuth from "next-auth/next";
import { authOptions } from "@/types/auth";

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };