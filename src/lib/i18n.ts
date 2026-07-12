/**
 * Camada de internacionalização (i18n) do Cub's.
 *
 * ─── Como adicionar um novo idioma ─────────────────────────────────────────
 * 1. Crie o arquivo de traduções em `src/locales/<slug>.json`
 *    (ex.: `en-us.json`), copiando a estrutura de chaves de `pt-br.json`.
 *    As chaves são hierárquicas: página / seção / componente
 *    (ex.: `pages.sign-in.entre-seja-bem-vindo`).
 * 2. Importe o JSON abaixo e registre-o em `LANGUAGES`, informando:
 *    - `slug`: como o idioma aparece na URL (`/en-us/sign-in`) — sempre minúsculo;
 *    - `locale`: o código BCP-47 usado pelo i18next (`en-US`);
 *    - `label`: nome de exibição do idioma;
 *    - `resource`: o JSON importado.
 * 3. Pronto — as rotas `/$lang/...` passam a aceitar o novo slug
 *    automaticamente e `i18n()` resolve as chaves nesse idioma.
 *
 * Regra do projeto: TODO conteúdo estático de tela passa por `i18n()`.
 * Nada de string solta em componente.
 * ───────────────────────────────────────────────────────────────────────────
 */
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import ptBr from '@locales/pt-br.json'

export interface Language {
  /** Slug usado na URL, sempre minúsculo (ex.: `pt-br`). */
  slug: string
  /** Código BCP-47 do idioma no i18next (ex.: `pt-BR`). */
  locale: string
  /** Nome de exibição do idioma. */
  label: string
  resource: Record<string, unknown>
}

export const LANGUAGES: Language[] = [
  { slug: 'pt-br', locale: 'pt-BR', label: 'Português (Brasil)', resource: ptBr },
]

export const DEFAULT_LANGUAGE = LANGUAGES[0]

export function findLanguageBySlug(slug: string): Language | undefined {
  return LANGUAGES.find((language) => language.slug === slug.toLowerCase())
}

i18next.use(initReactI18next).init({
  resources: Object.fromEntries(
    LANGUAGES.map((language) => [language.locale, { translation: language.resource }]),
  ),
  lng: DEFAULT_LANGUAGE.locale,
  fallbackLng: DEFAULT_LANGUAGE.locale,
  interpolation: {
    // React já escapa valores interpolados.
    escapeValue: false,
  },
})

/**
 * Utilitário de tradução por chave hierárquica (página / seção / componente).
 *
 * @example
 * i18n('pages.sign-in.entre-seja-bem-vindo') // → "Entre Seja Bem-Vindo!"
 */
export function i18n(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options)
}

export function changeLanguage(language: Language): void {
  if (i18next.language !== language.locale) {
    void i18next.changeLanguage(language.locale)
  }
}

export default i18next
