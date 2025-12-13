import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      title?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    title?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    title?: string | null;
  }
}
