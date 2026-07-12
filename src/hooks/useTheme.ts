import { useState } from 'react'

import { resolveInitialTheme, setTheme, type ThemePreference } from '@/lib/theme'

/**
 * Preferência de tema (light/dark) com persistência em localStorage.
 * O valor inicial já vem aplicado no <html> pelo script inline do index.html;
 * aqui só mantemos o estado React em sincronia e expomos o toggle.
 */
export function useTheme(): { theme: ThemePreference; toggleTheme: () => void } {
  const [theme, setThemeState] = useState<ThemePreference>(() => resolveInitialTheme())

  function toggleTheme(): void {
    const next: ThemePreference = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  return { theme, toggleTheme }
}
