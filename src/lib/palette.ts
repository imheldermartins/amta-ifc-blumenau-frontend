/**
 * Paleta de cores padrão do Cub's.
 *
 * Todas as classes ficam escritas por extenso (string literal) porque o
 * Tailwind só gera o CSS de classes que aparecem completas no código —
 * montar `bg-${cor}-600` em runtime não funciona.
 *
 * Para adicionar uma cor: inclua-a em `PALETTE_COLORS` e preencha a nova
 * entrada em `PALETTE` com as classes correspondentes.
 */
import { clsx } from 'clsx'

export const PALETTE_COLORS = [
  'blue',
  'red',
  'yellow',
  'orange',
  'purple',
  'green',
  'pink',
] as const

export type PaletteColor = (typeof PALETTE_COLORS)[number]

export interface PaletteEntry {
  /** Fundo sólido na cor. */
  bg: string
  /** Fundo sólido no estado hover. */
  bgHover: string
  /** Fundo suave (translúcido) na cor — bom para hover de outlined/chips. */
  bgSoft: string
  /** Texto na cor (ajustado para light/dark). */
  text: string
  /** Texto de contraste para usar SOBRE o fundo sólido. */
  textOnFilled: string
  /** Borda na cor (ajustada para light/dark). */
  border: string
}

export const PALETTE: Record<PaletteColor, PaletteEntry> = {
  blue: {
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-700',
    bgSoft: 'hover:bg-blue-600/10',
    text: 'text-blue-600 dark:text-blue-400',
    textOnFilled: 'text-white',
    border: 'border-blue-600 dark:border-blue-400',
  },
  red: {
    bg: 'bg-red-600',
    bgHover: 'hover:bg-red-700',
    bgSoft: 'hover:bg-red-600/10',
    text: 'text-red-600 dark:text-red-400',
    textOnFilled: 'text-white',
    border: 'border-red-600 dark:border-red-400',
  },
  yellow: {
    // Amarelo sólido precisa de texto escuro para manter contraste.
    bg: 'bg-yellow-400',
    bgHover: 'hover:bg-yellow-500',
    bgSoft: 'hover:bg-yellow-400/15',
    text: 'text-yellow-600 dark:text-yellow-400',
    textOnFilled: 'text-yellow-950',
    border: 'border-yellow-500 dark:border-yellow-400',
  },
  orange: {
    bg: 'bg-orange-600',
    bgHover: 'hover:bg-orange-700',
    bgSoft: 'hover:bg-orange-600/10',
    text: 'text-orange-600 dark:text-orange-400',
    textOnFilled: 'text-white',
    border: 'border-orange-600 dark:border-orange-400',
  },
  purple: {
    bg: 'bg-purple-600',
    bgHover: 'hover:bg-purple-700',
    bgSoft: 'hover:bg-purple-600/10',
    text: 'text-purple-600 dark:text-purple-400',
    textOnFilled: 'text-white',
    border: 'border-purple-600 dark:border-purple-400',
  },
  green: {
    bg: 'bg-green-600',
    bgHover: 'hover:bg-green-700',
    bgSoft: 'hover:bg-green-600/10',
    text: 'text-green-600 dark:text-green-400',
    textOnFilled: 'text-white',
    border: 'border-green-600 dark:border-green-400',
  },
  pink: {
    bg: 'bg-pink-600',
    bgHover: 'hover:bg-pink-700',
    bgSoft: 'hover:bg-pink-600/10',
    text: 'text-pink-600 dark:text-pink-400',
    textOnFilled: 'text-white',
    border: 'border-pink-600 dark:border-pink-400',
  },
}

/**
 * Helper sob demanda que combina `bg` + `text` de contraste de uma cor.
 *
 * @example
 * paletteBgText('blue') // → "bg-blue-600 text-white"
 */
export function paletteBgText(color: PaletteColor): string {
  const entry = PALETTE[color]
  return clsx(entry.bg, entry.textOnFilled)
}

/**
 * Combina `border` + `text` na própria cor (base do estilo outlined).
 *
 * @example
 * paletteBorderText('green') // → "border-green-600 dark:border-green-400 text-green-600 dark:text-green-400"
 */
export function paletteBorderText(color: PaletteColor): string {
  const entry = PALETTE[color]
  return clsx(entry.border, entry.text)
}
