/**
 * Tokens de tema do Cub's (base zinc), em pares light/dark.
 *
 * - background: zinc-100 (light) / zinc-950 (dark)
 * - contrast:   zinc-200 (light) / zinc-800 (dark) — superfícies elevadas (cards, inputs)
 * - divider:    zinc-300 (light) / zinc-700 (dark)
 * - text:       zinc-900 (light) / zinc-100 (dark)
 *
 * As mesmas cores existem como variáveis CSS em `src/index.css`
 * (--background, --contrast, --divider, --foreground) para os componentes
 * do shadcn/ui; aqui ficam as classes utilitárias prontas para compor com `cn`.
 */
export const THEME = {
  /** Fundo base da aplicação. */
  background: 'bg-zinc-100 dark:bg-zinc-950',
  /** Superfície de contraste (cards, inputs, painéis). */
  contrast: 'bg-zinc-200 dark:bg-zinc-800',
  /** Cor de divisores/bordas neutras. */
  divider: 'border-zinc-300 dark:border-zinc-700',
  /** Cor padrão de texto. */
  text: 'text-zinc-900 dark:text-zinc-100',
  /** Texto secundário/apagado. */
  textMuted: 'text-zinc-600 dark:text-zinc-400',
} as const

export type ThemeToken = keyof typeof THEME

/* ─── Preferência light/dark (persistida em localStorage) ─────────────────
 * O dark mode é a classe `.dark` no <html> (ver @custom-variant no
 * index.css). Um script inline no index.html aplica o tema salvo ANTES do
 * React montar (evita flash); aqui ficam a leitura/gravação usadas pelo
 * hook useTheme.
 */
export type ThemePreference = 'light' | 'dark'

const THEME_STORAGE_KEY = 'cubs.theme'

export function getStoredTheme(): ThemePreference | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

/** Tema salvo, ou a preferência do sistema como fallback. */
export function resolveInitialTheme(): ThemePreference {
  return (
    getStoredTheme() ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
}

/** Aplica no <html> e persiste. */
export function setTheme(theme: ThemePreference): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}
