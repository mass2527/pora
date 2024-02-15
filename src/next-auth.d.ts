/* eslint-disable unused-imports/no-unused-vars */
import { User } from "next-auth";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    jobPosition?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      jobPosition?: string | null;
    };
  }
}
