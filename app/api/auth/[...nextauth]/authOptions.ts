import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions, User } from "next-auth";
import { prisma } from "@/lib/prisma";

// NextAuth konfigürasyonu: Kimlik doğrulama ayarlarını içerir.
export const authOptions: NextAuthOptions = {
  // Prisma veritabanı adaptörü kullan (Kullanıcıları DB'de saklar)
  adapter: PrismaAdapter(prisma),

  providers: [
    // GitHub ile Giriş Sağlayıcısı
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true, // Aynı email'e sahip hesapları birleştir
    }),

    // Google ile Giriş Sağlayıcısı
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Aynı email'e sahip hesapları birleştir
    }),

    // E-posta ile Giriş (Magic Link) Sağlayıcısı (Gmail SMTP)
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { createTransport } = await import("nodemailer");
        const transport = createTransport(provider.server);
        new URL(url);

        const result = await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `CareerAI'ye Giriş Yap`,
          text: `CareerAI'ye giriş yapmak için şu bağlantıya tıklayın: ${url}`,
          html: `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>CareerAI Giriş</title>
            </head>
            <body style="background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                  <td align="center" style="padding: 40px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px;">
                          <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">CareerAI</h1>
                        </td>
                      </tr>
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                          <h2 style="color: #1f2937; font-size: 20px; font-weight: 700; margin-bottom: 20px;">Tekrar Hoş Geldiniz!</h2>
                          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Hesabınıza güvenli bir şekilde giriş yapmak için aşağıdaki butonu kullanabilirsiniz. Bu bağlantı 24 saat boyunca geçerlidir.
                          </p>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td align="center">
                                <a href="${url}" target="_blank" style="background-color: #4f46e5; border-radius: 8px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: 600; padding: 16px 32px; text-decoration: none; transition: background-color 0.2s;">
                                  Giriş Yap
                                </a>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #9ca3af; font-size: 14px; margin-top: 40px; text-align: center;">
                            Eğer bu isteği siz yapmadıysanız, bu e-postayı güvenle silebilirsiniz.
                          </p>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center;">
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            © 2025 CareerAI. Tüm hakları saklıdır.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });

        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // OAuth providers (Google, GitHub) veya Email ile giriş
      if (user.email) {
        // DB'den kullanıcıyı kontrol et
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { name: true },
        });

        // Sadece DB'de name NULL ise update et
        if (dbUser && !dbUser.name) {
          const userName = user.name || user.email.split("@")[0];
          await prisma.user.update({
            where: { email: user.email },
            data: { 
              emailVerified: new Date(),
              name: userName,
            },
          });
        } else if (dbUser) {
          // Name varsa sadece emailVerified güncelle
          await prisma.user.update({
            where: { email: user.email },
            data: { emailVerified: new Date() },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        // İstemci tarafında update() çağrıldığında token'ı güncelle
        return { ...token, ...session.user };
      }
      if (user) {
        return { ...token, ...user, title: (user as User).title };
      }

      // HER TOKEN REFRESH: name yoksa DB'den al veya oluştur
      if (token.email && (!token.name || token.name === null)) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });

        if (dbUser && !dbUser.name) {
          // DB'de de name yoksa email'den oluştur
          const generatedName = (token.email as string).split("@")[0];
          await prisma.user.update({
            where: { email: token.email as string },
            data: { name: generatedName },
          });
          token.name = generatedName;
        } else if (dbUser?.name) {
          // DB'de name varsa token'a koy
          token.name = dbUser.name;
        }
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
