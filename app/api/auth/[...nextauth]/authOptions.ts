import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions, User } from "next-auth";
import { prisma } from "@/app/lib/prisma";

// NextAuth konfigürasyonu: Kimlik doğrulama ayarlarını içerir.
export const authOptions: NextAuthOptions = {
  // Prisma veritabanı adaptörü kullan (Kullanıcıları DB'de saklar)
  adapter: PrismaAdapter(prisma),

  providers: [
    // GitHub ile Giriş Sağlayıcısı
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    // Google ile Giriş Sağlayıcısı
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // E-posta ile Giriş (Magic Link) Sağlayıcısı
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!, // E-postanın kimden gideceği
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        // İstemci tarafında update() çağrıldığında token'ı güncelle
        return { ...token, ...session.user };
      }
      if (user) {
        return { ...token, ...user, title: (user as User).title };
      }
      return token;
    },
    async session({ session, token }) {
      // Token'daki güncel verileri session'a aktar
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.title = token.title;
      }
      return session;
    },
  },

  // Oturum stratejisi: JWT (JSON Web Token) kullanılır.
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET, // JWT şifreleme anahtarı

  // Özel giriş sayfaları (Opsiyonel)
  pages: {
    signIn: "/auth/signin", // Kullanıcı özel giriş sayfasına yönlendirilir.
  },
};
