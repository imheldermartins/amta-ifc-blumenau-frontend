/**
 * Paleta de cores de destaque do Cub's.
 *
 * As chaves são SEMÂNTICAS e mapeiam para hues do Tailwind:
 *   red → rose · blue → blue · purple → violet · green → emerald
 *
 * Regra de tema: superfícies/bordas na cor usam o tom `-600` no light theme
 * e `-500` no dark theme. Texto sobre fundo colorido (filled) é sempre branco
 * (#FFFFFF). Texto NA cor (outlined, text, erros, links) usa `-600`/`-400`
 * para manter contraste de leitura.
 *
 * Todas as classes ficam escritas por extenso (string literal) porque o
 * Tailwind só gera o CSS de classes que aparecem completas no código —
 * montar `bg-${cor}-600` em runtime não funciona.
 *
 * Para adicionar uma cor: inclua a chave em `PALETTE_COLORS` e preencha a
 * nova entrada em `PALETTE` seguindo a regra 300/500.
 */
import { clsx } from 'clsx'

export const PALETTE_COLORS = ['blue', 'red', 'purple', 'green'] as const

export type PaletteColor = (typeof PALETTE_COLORS)[number]

export interface PaletteEntry {
  /** Fundo sólido na cor (300 light / 500 dark). */
  bg: string
  /** Fundo sólido no estado hover (um tom acima). */
  bgHover: string
  /** Fundo suave (translúcido) na cor — bom para hover de outlined/chips. */
  bgSoft: string
  /** Texto NA cor, legível sobre o background do tema. */
  text: string
  /** Texto de contraste para usar SOBRE o fundo sólido. */
  textOnFilled: string
  /** Borda na cor (300 light / 500 dark). */
  border: string
}

export const PALETTE: Record<PaletteColor, PaletteEntry> = {
  blue: {
    bg: 'bg-blue-600 dark:bg-blue-500',
    bgHover: 'hover:bg-blue-400 dark:hover:bg-blue-600',
    bgSoft: 'hover:bg-blue-600/25 dark:hover:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    textOnFilled: 'text-white',
    border: 'border-blue-600 dark:border-blue-500',
  },
  red: {
    bg: 'bg-rose-600 dark:bg-rose-500',
    bgHover: 'hover:bg-rose-400 dark:hover:bg-rose-600',
    bgSoft: 'hover:bg-rose-600/25 dark:hover:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    textOnFilled: 'text-white',
    border: 'border-rose-600 dark:border-rose-500',
  },
  purple: {
    bg: 'bg-violet-600 dark:bg-violet-500',
    bgHover: 'hover:bg-violet-400 dark:hover:bg-violet-600',
    bgSoft: 'hover:bg-violet-600/25 dark:hover:bg-violet-500/20',
    text: 'text-violet-600 dark:text-violet-400',
    textOnFilled: 'text-white',
    border: 'border-violet-600 dark:border-violet-500',
  },
  green: {
    bg: 'bg-emerald-600 dark:bg-emerald-500',
    bgHover: 'hover:bg-emerald-400 dark:hover:bg-emerald-600',
    bgSoft: 'hover:bg-emerald-600/25 dark:hover:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    textOnFilled: 'text-white',
    border: 'border-emerald-600 dark:border-emerald-500',
  },
}

/**
 * Helper sob demanda que combina `bg` + `text` de contraste de uma cor.
 *
 * @example
 * paletteBgText('blue') // → "bg-blue-600 dark:bg-blue-500 text-white"
 */
export function paletteBgText(color: PaletteColor): string {
  const entry = PALETTE[color]
  return clsx(entry.bg, entry.textOnFilled)
}

/**
 * Combina `border` + `text` na própria cor (base do estilo outlined).
 *
 * @example
 * paletteBorderText('green') // → "border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400"
 */
export function paletteBorderText(color: PaletteColor): string {
  const entry = PALETTE[color]
  return clsx(entry.border, entry.text)
}
