import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma";

// Global Prisma istemcisi tanımı (Development ortamında hot-reload sorunlarını önlemek için)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Neon adapter yapılandırması (Prisma 7 için gerekli)
const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });

// Prisma istemcisini dışa aktar (Veritabanı bağlantısı)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Sorguları ve hataları konsola logla
    log: ["query", "error", "warn"],
  });

// Production değilse global değişkene ata
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
