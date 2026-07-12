/**
 * Aliases de classe prontos para compor com `cn`, apontando para os tokens
 * de cor registrados em `src/index.css`.
 *
 * FONTE ÚNICA são as variáveis CSS do index.css — como cada alias usa o
 * utilitário do token (bg-background, bg-active, ...), mudar o valor lá
 * reflete aqui automaticamente, sem duplicar os tons zinc. Exceção:
 * `textMuted`, que não tem token próprio (usa zinc direto).
 */
export const THEME = {
  /** Fundo base da aplicação (zinc-100 / zinc-900). */
  background: 'bg-background',
  /** Superfície de contraste — painéis, inputs (zinc-200 / zinc-800). */
  contrast: 'bg-contrast',
  /** Fundo de item ativo/hover (zinc-300 / zinc-700; mesmo tom do divider). */
  active: 'bg-active',
  /** Cor de divisores/bordas neutras (zinc-300 / zinc-700). */
  divider: 'border-divider',
  /** Cor padrão de texto (zinc-900 / zinc-100). */
  text: 'text-foreground',
  /** Texto secundário/apagado — sem token próprio (zinc-600 / zinc-400). */
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
