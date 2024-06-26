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
        // console.log('\x1b[36m%s\x1b[0m', 'user 1', user);
        const existingGuest = await getUser(user?.email);

        if (!existingGuest) {
          await createUser({
            email: user.email,
            fullName: user.name,
            photo: user.image,
          });
        }
        return true;
      } catch (err) {
        // console.log('\x1b[36m%s\x1b[0m', 'false', err.message);
        return false;
      }
    },
    // 3. Store userId in session
    async session({ session, user }) {
      const loggedUser = await getUser(session.user.email);
      session.user.id = loggedUser._id;
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
