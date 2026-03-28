import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users, accounts, sessions, verificationTokens } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;
        const name = credentials.name as string;
        const isSignUp = credentials.isSignUp === "true";

        if (!email || !password) return null;

        const existing = await db.select().from(users).where(eq(users.email, email)).get();

        if (isSignUp) {
          if (existing) return null;
          const hash = await bcrypt.hash(password, 10);
          const id = crypto.randomUUID();
          await db.insert(users).values({
            id,
            name: name || email.split("@")[0],
            email,
            passwordHash: hash,
          });
          return { id, name: name || email.split("@")[0], email };
        }

        if (!existing || !existing.passwordHash) return null;
        const valid = await bcrypt.compare(password, existing.passwordHash);
        if (!valid) return null;
        return { id: existing.id, name: existing.name, email: existing.email };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
