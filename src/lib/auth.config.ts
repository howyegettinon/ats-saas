import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        // Check and reset usage credits if needed
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (dbUser) {
          const lastReset = dbUser.lastReset;
          const now = new Date();
          const daysSinceReset = Math.floor(
            (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysSinceReset >= 1) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                usageCredits: 10,
                lastReset: now,
              },
            });
          }
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          usageCredits: 10,
          lastReset: new Date(),
        },
      });
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
