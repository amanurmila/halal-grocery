export const runtime = "nodejs";

import NextAuthModule from "next-auth";
import GoogleModule from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// ✅ Handle ESM/CommonJS compatibility
const NextAuth = NextAuthModule.default || NextAuthModule;
const GoogleProvider = GoogleModule.default || GoogleModule;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // 🔐 On sign in
    async signIn({ user }) {
      await dbConnect();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: "user",
          isBlocked: false,
        });
      }

      return true;
    },

    // 🔑 JWT callback
    async jwt({ token, user }) {
      await dbConnect();

      const dbUser = await User.findOne({
        email: token.email || user?.email,
      });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.picture = dbUser.image;
        token.isBlocked = dbUser.isBlocked;
      }

      return token;
    },

    // 🧠 Session callback
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture;
        session.user.isBlocked = token.isBlocked;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
