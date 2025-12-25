// Rate Limiting Utility - API isteklerini sınırlamak için

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

/**
 * Rate limit kontrolü yapar
 * @param userId - Kullanıcı ID'si
 * @param limit - Dakikada izin verilen maksimum istek sayısı
 * @param windowMs - Zaman penceresi (milisaniye)
 * @returns {allowed: boolean, remaining: number, resetTime: number}
 */
export function checkRateLimit(
  userId: string,
  limit: number = 10, // Dakikada 10 istek
  windowMs: number = 60 * 1000 // 1 dakika
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const userLimit = rateLimitStore[userId];

  // İlk istek veya zaman penceresi dolmuşsa sıfırla
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore[userId] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  // Limit aşılmış mı kontrol et
  if (userLimit.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: userLimit.resetTime,
    };
  }

  // İsteği say
  userLimit.count += 1;
  return {
    allowed: true,
    remaining: limit - userLimit.count,
    resetTime: userLimit.resetTime,
  };
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      lastError = err;

      // Rate limit hatası mı kontrol et
      if (
        err.message?.includes("429") ||
        err.message?.includes("RESOURCE_EXHAUSTED")
      ) {
        // Exponential backoff: 1s, 2s, 4s...
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(
          `Rate limit hit. Retrying in ${delay}ms... (Attempt ${
            attempt + 1
          }/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Başka bir hata, retry yapma
        throw err;
      }
    }
  }

  // Tüm denemeler başarısız
  throw lastError || new Error("Max retries exceeded");
}
