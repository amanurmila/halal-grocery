export const runtime = "nodejs";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    // ✅ When a user signs in
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

    // ✅ Add custom data to JWT token
    async jwt({ token, user }) {
      await dbConnect();
      const dbUser = await User.findOne({ email: token.email || user?.email });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.picture = dbUser.image;
        token.isBlocked = dbUser.isBlocked; // ✅ FIXED: include isBlocked here
      }

      return token;
    },

    // ✅ Attach all custom fields to the session
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture;
        session.user.isBlocked = token.isBlocked; // ✅ FIXED: now available on frontend
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
