import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return true // Allow sign in
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Force redirect to dashboard after successful sign in
      return `${baseUrl}/dashboard`
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  debug: true, // Turn on debug mode
}
