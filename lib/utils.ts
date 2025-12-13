import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// cn (ClassName) fonksiyonu: Dinamik ve koşullu CSS sınıflarını birleştirmek için kullanılır.
// TailwindCSS ile çalışırken çakışan sınıfları (twMerge) ve koşullu sınıfları (clsx) düzgünce işler.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
