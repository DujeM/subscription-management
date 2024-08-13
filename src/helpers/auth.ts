import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.client.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const correctPassword = await compare(
          credentials.password,
          user.password
        );

        if (!correctPassword) {
          throw new Error("Wrong password");
        }

        return user;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  callbacks: {
    session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          accountId: token.accountId as string,
        },
      };
    },
    async jwt({ token, user }) {
      const client = await prisma.client.findUnique({
        where: {
          id: token.sub,
        },
      });

      return {
        ...token,
        accountId: client.accountId,
      };
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
