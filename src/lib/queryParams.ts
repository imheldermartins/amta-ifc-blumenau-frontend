/**
 * Regras de leitura e escrita da query string — parte PURA (sem React, sem
 * router). O hook `useQueryParams` só liga isto ao TanStack Router; toda
 * decisão de semântica mora aqui, então é aqui que se testa.
 *
 * ─── O que o TanStack já faz por baixo (e por que importa) ──────────────────
 * O router NÃO entrega a query como texto: o `parseSearch` padrão coage cada
 * valor antes de você ver.
 *
 *   ?name=Helder&age=20&ativo=true
 *   → { name: 'Helder', age: 20, ativo: true }   // number e boolean, não string
 *
 * Chave repetida vira ARRAY (`?tag=a&tag=b` → `{ tag: ['a', 'b'] }`), e um
 * valor que seja JSON válido vira objeto. Ou seja: `search[key]` é `unknown` de
 * verdade — daí os leitores explícitos abaixo (`readText`, `readNumber`, ...)
 * em vez de confiar no tipo que veio.
 *
 * ─── A invariante do módulo: VAZIO É AUSENTE ────────────────────────────────
 * `null`, `undefined` e `''` são a mesma coisa nos dois sentidos:
 *
 *  • escrevendo → a chave SOME da URL (nunca gera `?q=` pendurado);
 *  • lendo      → devolve `undefined` (e `has()` responde `false`).
 *
 * É o que faz um campo de busca esvaziado voltar à URL limpa sem o chamador
 * ficar traduzindo `''` para `undefined` na mão. O custo: não dá para guardar
 * string vazia como valor — se um dia isso for necessário, é aqui que muda.
 *
 * O apagar depende de um detalhe do serializador: o `encode` do router pula
 * chave com valor `undefined` (e SÓ `undefined` — `null` viraria `?k=null`).
 * Por isso `applyQueryPatch` normaliza todo vazio para `undefined`.
 */

/** Valor aceito ao ESCREVER. `null`/`undefined`/`''` apagam a chave. */
export type QueryValue = string | number | boolean | null | undefined

/** Escrita em lote — `{ name: 'Helder', age: 20 }` vira `?name=Helder&age=20`. */
export type QueryPatch<TKey extends string = string> = Partial<Record<TKey, QueryValue>>

/**
 * Query crua como o router entrega. `unknown` no valor é honestidade, não
 * preguiça: depois da coerção acima pode ser string, number, boolean, array
 * ou objeto.
 */
export type QueryRecord = Record<string, unknown>

/** Vazio = ausente (ver invariante no topo). */
function isBlank(value: QueryValue): boolean {
  return value == null || value === ''
}

/**
 * Aplica um patch sobre a query atual. Chave fora do patch fica intacta —
 * mexer em `q` não pode derrubar o `view` de quem estava na mesma tela.
 */
export function applyQueryPatch(current: QueryRecord, patch: QueryPatch): QueryRecord {
  const next: QueryRecord = { ...current }

  for (const [key, value] of Object.entries(patch)) {
    next[key] = isBlank(value) ? undefined : value
  }

  return next
}

/**
 * Substitui a query INTEIRA: o que não estiver em `next` é apagado.
 * `replaceQuery(current, {})` é o "limpa tudo".
 */
export function replaceQuery(current: QueryRecord, next: QueryPatch): QueryRecord {
  const cleared: QueryRecord = {}
  for (const key of Object.keys(current)) {
    cleared[key] = undefined
  }

  return applyQueryPatch(cleared, next)
}

/**
 * Leitura padrão: sempre string, custe o que custar ao tipo original.
 *
 * `?age=20` chega como number 20 e sai daqui como `'20'` — quem escreveu a URL
 * pensou em texto, e ler texto de um lugar e number de outro dependendo do que
 * o usuário digitou é a receita do bug intermitente. Para number/boolean, peça
 * explicitamente (`readNumber`/`readBoolean`).
 *
 * Chave repetida devolve só o PRIMEIRO valor; a lista inteira vem em `readList`.
 */
export function readText(value: unknown): string | undefined {
  if (Array.isArray(value)) return readText(value[0])
  if (value == null || value === '') return undefined
  if (typeof value === 'object') return undefined
  return String(value)
}

export function readNumber(value: unknown): number | undefined {
  const text = readText(value)
  if (text === undefined) return undefined

  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : undefined
}

/** Só `true`/`false` literais viram boolean; qualquer outro texto é `undefined`. */
export function readBoolean(value: unknown): boolean | undefined {
  const text = readText(value)
  if (text === 'true') return true
  if (text === 'false') return false
  return undefined
}

/** Chave repetida (`?tag=a&tag=b`) como lista. Valor único vira lista de um. */
export function readList(value: unknown): string[] {
  if (value == null) return []

  const items = Array.isArray(value) ? value : [value]
  return items.map(readText).filter((item): item is string => item !== undefined)
}
