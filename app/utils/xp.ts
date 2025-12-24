import { prisma } from "@/lib/prisma";

// XP değerleri
export const XP_VALUES = {
  CV_UPLOAD: 10,
  CV_ANALYSIS: 25,
  INTERVIEW_COMPLETE: 50,
} as const;

// Seviye isimleri
export function getLevelName(level: number): string {
  if (level <= 2) return "Başlangıç";
  if (level <= 5) return "Orta Seviye";
  if (level <= 10) return "İleri Seviye";
  return "Uzman";
}

// Belirli bir seviye için gereken toplam XP
export function getXPForLevel(level: number): number {
  // Her seviye 100 * level XP gerektirir
  // Level 1->2: 100 XP
  // Level 2->3: 200 XP
  // Level 3->4: 300 XP
  return 100 * level;
}

// Kullanıcının mevcut XP'sine göre seviye ve progress hesapla
export function calculateLevel(currentXP: number): {
  level: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  progress: number; // 0-100 arası yüzde
} {
  let level = 1;
  let totalXP = 0;
  
  // Mevcut seviyeyi bul
  while (totalXP + getXPForLevel(level) <= currentXP) {
    totalXP += getXPForLevel(level);
    level++;
  }
  
  const xpInCurrentLevel = currentXP - totalXP;
  const xpForNextLevel = getXPForLevel(level);
  const progress = Math.floor((xpInCurrentLevel / xpForNextLevel) * 100);
  
  return {
    level,
    xpInCurrentLevel,
    xpForNextLevel,
    progress,
  };
}

// Kullanıcıya XP ekle ve seviye güncelle
export async function addXP(userId: string, amount: number): Promise<{
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
  newXP: number;
  newLevelName: string;
}> {
  // 1. Önce eski seviyeyi ve verileri alalım (Opsiyonel ama dönüş değerleri için gerekli)
  const oldUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true, xp: true },
  });

  if (!oldUser) {
    throw new Error("Kullanıcı bulunamadı");
  }

  // 2. XP'yi atomik olarak artır ve güncel kullanıcıyı al
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: { increment: amount },
    },
    select: { level: true, xp: true },
  });

  const oldLevel = updatedUser.level;
  const currentTotalXP = updatedUser.xp;

  // 3. Yeni seviye ve isimleri hesapla
  const levelInfo = calculateLevel(currentTotalXP);
  const newLevel = levelInfo.level;
  const newLevelName = getLevelName(newLevel);

  let finalLevel = newLevel;
  let finalLevelName = newLevelName;

  // 4. Eğer seviye değişmişse veritabanını tekrar güncelle (Seviye ve İsim için)
  if (newLevel !== oldLevel) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        level: newLevel,
        levelName: newLevelName,
      },
    });
  }

  return {
    oldLevel,
    newLevel: finalLevel,
    leveledUp: finalLevel > oldLevel,
    newXP: currentTotalXP,
    newLevelName: finalLevelName,
  };
}
