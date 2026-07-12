import type { ComponentProps } from 'react'

import { PALETTE, type PaletteColor } from '@/lib/palette'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'filled' | 'outlined'

export interface ButtonProps extends ComponentProps<'button'> {
  /** Estilo visual do botão. */
  variant?: ButtonVariant
  /** Cor da paleta do projeto (src/lib/palette.ts). */
  color?: PaletteColor
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50'

export function Button({
  variant = 'filled',
  color = 'blue',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  const entry = PALETTE[color]

  const variantClasses =
    variant === 'filled'
      ? cn(entry.bg, entry.textOnFilled, entry.bgHover)
      : cn('border bg-transparent', entry.border, entry.text, entry.bgSoft)

  return <button type={type} className={cn(BASE_CLASSES, variantClasses, className)} {...props} />
}
