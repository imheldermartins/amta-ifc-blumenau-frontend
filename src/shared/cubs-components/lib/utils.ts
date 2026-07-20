import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes condicionalmente (clsx) e resolve conflitos de utilitários
 * Tailwind (tailwind-merge). É o util padrão de composição de classes do
 * projeto — app e libs autorais usam ESTE, não uma cópia local.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
