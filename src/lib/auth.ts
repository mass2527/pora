import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import { cache } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.jobPosition = token.jobPosition;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        jobPosition: dbUser.jobPosition,
      };
    },
  },
};

async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function getUser() {
  const session = await getSession();

  return session?.user;
}

export const getAuthenticatedUserId = cache(async () => {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/login");
  }

  return user.id;
});

export function useAuthenticatedUser() {
  const session = useSession();
  const user = session.data?.user;
  if (!user) {
    redirect("/login");
  }

  return user;
}
