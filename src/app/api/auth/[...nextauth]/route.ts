import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    verifyRequest: '/verify-request',
    newUser: '/signup',
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token }) {
      // Add custom session properties here if needed
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler = (req, res) => NextAuth(req, res, options);

export { authHandler as GET, authHandler as POST };
