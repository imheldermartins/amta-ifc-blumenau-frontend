import { Icon } from '@iconify/react'
import { cn } from 'cubs-components'

import { useTheme } from '@/hooks/useTheme'
import { i18n } from '@/lib/i18n'

export interface ThemeToggleProps {
  className?: string
}

/** Botão de alternância light/dark (persistido em localStorage). */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const label =
    theme === 'dark' ? i18n('common.mudar-tema-claro') : i18n('common.mudar-tema-escuro')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded border border-divider',
        'bg-contrast text-foreground transition-colors hover:bg-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-divider',
        className,
      )}
    >
      <Icon icon={theme === 'dark' ? 'lucide:sun' : 'lucide:moon'} className="size-4" />
    </button>
  )
}
