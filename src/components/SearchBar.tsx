import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { TextField, cn } from 'cubs-components'

import { useQueryParams } from '@/hooks/useQueryParams'
import { i18n } from '@/lib/i18n'
import { THEME } from '@/lib/theme'

export interface SearchBarProps {
  /** Chave da query onde o texto fica. Padrão: `q` (`?q=helder`). */
  paramKey?: string
  placeholder?: string
  /** Rótulo acessível — o campo não tem label visível. */
  label?: string
  /** Espera entre a última tecla e a escrita na URL. `0` escreve na hora. */
  debounceMs?: number
  className?: string
}

/**
 * Campo de busca cujo estado É a URL (`?q=...`), via `useQueryParams`.
 *
 * Não recebe `value`/`onChange` nem avisa ninguém por callback: quem precisa
 * do texto lê `useQueryParams().get('q')` de onde estiver. É o que permite ele
 * morar no layout e servir telas que não o conhecem — e o que faz a busca
 * sobreviver a copiar o link, favoritar e recarregar a página.
 *
 * ─── Por que existe estado local aqui, se a URL já é o estado ───────────────
 * O campo é rápido (estado local) e a URL vem atrás (debounce). Ler o `value`
 * direto da URL faria cada tecla esperar uma navegação para aparecer na tela —
 * e o refetch de quem observa `?q=` dispararia por caractere.
 *
 * A `ref` é o que impede os dois sentidos de brigarem: ela guarda o último
 * valor que ESTE campo mandou para a URL, então a re-sincronia só age quando a
 * URL mudou por FORA (voltar/avançar, link colado, outro componente escrevendo).
 * Sem ela, a URL atrasada devolveria texto velho ao campo no meio da digitação.
 *
 * @example
 * <SearchBar />                                  // ?q=
 * <SearchBar paramKey="docente" debounceMs={0} /> // ?docente=, sem espera
 */
export function SearchBar({
  paramKey = 'q',
  placeholder = i18n('common.busca.placeholder'),
  label = i18n('common.busca.rotulo'),
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const query = useQueryParams()
  const urlValue = query.get(paramKey) ?? ''

  const [value, setValue] = useState(urlValue)
  const pushedRef = useRef(urlValue)

  // `set` é estável (o `navigate` do router é), então dá para depender dele
  // sem reiniciar o timer do debounce a cada render.
  const setQuery = query.set

  useEffect(() => {
    if (urlValue === pushedRef.current) return
    pushedRef.current = urlValue
    setValue(urlValue)
  }, [urlValue])

  useEffect(() => {
    if (value === pushedRef.current) return

    const timer = setTimeout(() => {
      pushedRef.current = value
      // `replace`: digitar não é navegar. Sem isso, cada tecla vira uma entrada
      // no histórico e o "voltar" apaga a busca letra por letra.
      setQuery(paramKey, value, { replace: true })
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs, paramKey, setQuery])

  function clear() {
    pushedRef.current = ''
    setValue('')
    // Direto, sem esperar o debounce: limpar é um gesto, não digitação.
    setQuery(paramKey, null, { replace: true })
  }

  return (
    <div role="search" className={className}>
      <TextField
        type="search"
        size="sm"
        surface="contrast"
        value={value}
        aria-label={label}
        placeholder={placeholder}
        // O botão de limpar só existe com texto, mas o espaço dele é reservado
        // sempre — senão o texto pula ao digitar o primeiro caractere.
        inputClassName="pr-9"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') clear()
        }}
        startAdornment={
          <Icon icon="lucide:search" fontSize={16} className={cn('shrink-0', THEME.textMuted)} />
        }
        endAdornment={
          value !== '' && (
            <button
              type="button"
              onClick={clear}
              aria-label={i18n('common.busca.limpar')}
              className={cn(
                'cursor-pointer rounded p-0.5 transition-colors hover:bg-active',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-divider-contrast',
              )}
            >
              <Icon icon="lucide:x" fontSize={14} className={THEME.textMuted} />
            </button>
          )
        }
      />
    </div>
  )
}
