import { PrismaClient } from "../generated/prisma";

// Global Prisma istemcisi tanımı (Development ortamında hot-reload sorunlarını önlemek için)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma istemcisini dışa aktar (Veritabanı bağlantısı)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Sorguları ve hataları konsola logla
    log: ["query", "error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Production değilse global değişkene ata
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
