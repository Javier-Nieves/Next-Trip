import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createUser, getUser } from './data-service';

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // for protected routes:
  callbacks: {
    // 2. Create user on first login
    async signIn({ user, account, profile }) {
      // if user exists - move on, if not - create user document in the DB
      try {
        const existingGuest = await getUser(user?.email);

        if (!existingGuest) {
          await createUser({ email: user.email, fullName: user.name });
        }
        return true;
      } catch {
        return false;
      }
    },
    // 3. Store userId in session
    async session({ session, user }) {
      const loggedUser = await getUser(session.user.email);
      session.user.guestId = loggedUser._id;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
