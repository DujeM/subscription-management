import { config } from "@/helpers/auth";
import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = NextAuth(config);

export { authOptions as GET, authOptions as POST };
