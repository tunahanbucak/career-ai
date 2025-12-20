import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Güvenlik Başlıkları
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Görüntü Optimizasyonu için İzin Verilen Alan Adları
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profil resimleri için
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub profil resimleri için
      },
    ],
  },
};

export default nextConfig;
