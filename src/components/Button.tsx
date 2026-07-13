import type { ComponentProps } from 'react'

import { PALETTE, type PaletteColor, type PaletteEntry } from '@/lib/palette'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'filled' | 'outlined' | 'text'

/**
 * Cor do botão: qualquer cor da paleta (src/lib/palette.ts) OU `from-theme`,
 * que não usa um hue e sim os tokens neutros do tema — `foreground` no texto
 * e `active` no fundo (base zinc, acompanha light/dark).
 */
export type ButtonColor = PaletteColor | 'from-theme'

export interface ButtonProps extends ComponentProps<'button'> {
  /** Estilo visual do botão. */
  variant?: ButtonVariant
  /** Cor da paleta, ou `from-theme` (neutro, base zinc). Padrão: purple. */
  color?: ButtonColor
}

/**
 * Entrada de cor do `from-theme`, montada com os tokens do tema em vez de um
 * hue: texto em `foreground`, fundo em `active`. As classes ficam literais
 * (o Tailwind só gera o que vê escrito) — este arquivo é a fonte delas.
 */
const THEME_ENTRY: PaletteEntry = {
  bg: 'bg-active',
  bgHover: 'hover:bg-contrast',
  bgSoft: 'hover:bg-active',
  text: 'text-foreground',
  textOnFilled: 'text-foreground',
  border: 'border-divider',
  shadow: 'shadow-xl shadow-divider/20',
}

function resolveColor(color: ButtonColor): PaletteEntry {
  return color === 'from-theme' ? THEME_ENTRY : PALETTE[color]
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium cursor-pointer ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-divider ' +
  'disabled:pointer-events-none disabled:opacity-50'

function variantClasses(variant: ButtonVariant, c: PaletteEntry): string {
  switch (variant) {
    case 'filled':
      return cn(c.bg, c.textOnFilled, c.bgHover)
    case 'outlined':
      return cn('border bg-transparent', c.border, c.text, c.bgSoft)
    case 'text':
      // Em repouso, só a cor do texto; o fundo aparece no hover.
      return cn('bg-transparent', c.text, c.bgSoft)
  }
}

export function Button({
  variant = 'filled',
  color = 'purple',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  const classes = variantClasses(variant, resolveColor(color))

  return <button type={type} className={cn(BASE_CLASSES, classes, className)} {...props} />
}
