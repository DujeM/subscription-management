import { config } from "@/helpers/auth";
import NextAuth, { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = config;
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
