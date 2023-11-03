import dbConnect from '../../../lib/db';
import { User } from '../../../lib/models';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await dbConnect();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }
          return user;
        } catch (error) {
          console.log('Error desconhecido: ', error);
        }
      },
    }),
  ],
  callbacks: {
    session: async (session, user) => {
      if (!session) return Promise.resolve(session);
      
      await dbConnect();
      session.data = await User.findOne({ email: session.session.user.email }).populate('role').select('-password');

      return Promise.resolve(session);
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };