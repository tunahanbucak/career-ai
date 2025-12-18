import { prisma } from "@/app/lib/prisma";

// XP değerleri
export const XP_VALUES = {
  CV_UPLOAD: 10,
  CV_ANALYSIS: 25,
  INTERVIEW_COMPLETE: 50,
} as const;

// Seviye isimleri
export function getLevelName(level: number): string {
  if (level <= 2) return "Beginner";
  if (level <= 5) return "Intermediate";
  if (level <= 10) return "Advanced";
  return "Expert";
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
  // Mevcut kullanıcıyı al
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true, xp: true, levelName: true },
  });
  
  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }
  
  const oldLevel = user.level;
  const newXP = user.xp + amount;
  
  // Yeni seviyeyi hesapla
  const levelInfo = calculateLevel(newXP);
  const newLevel = levelInfo.level;
  const newLevelName = getLevelName(newLevel);
  
  // Veritabanını güncelle
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
      levelName: newLevelName,
    },
  });
  
  return {
    oldLevel,
    newLevel,
    leveledUp: newLevel > oldLevel,
    newXP,
    newLevelName,
  };
}
