import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add more providers here
  ],
  pages: {
    signIn: '/auth/signin',
  },
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
