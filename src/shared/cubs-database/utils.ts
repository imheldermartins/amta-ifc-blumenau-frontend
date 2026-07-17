/** Junta classes ignorando valores falsy — mínimo e sem dependências. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Formata um valor de célula para exibição na tabela. */
export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? '✓' : '✕'
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/** Alfabeto Crockford base32 (sem I, L, O, U) usado pelo ULID. */
const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/**
 * Gera um ULID (26 chars: 48 bits de tempo + 80 de aleatoriedade). Uso aqui é
 * identidade de views/linhas, não segurança — a aleatoriedade é Math.random.
 */
export function ulid(seedTime: number = Date.now()): string {
  let time = seedTime
  let encoded = ''
  for (let i = 0; i < 10; i++) {
    encoded = ULID_ALPHABET[time % 32] + encoded
    time = Math.floor(time / 32)
  }
  for (let i = 0; i < 16; i++) {
    encoded += ULID_ALPHABET[Math.floor(Math.random() * 32)]
  }
  return encoded
}

/**
 * Reordena itens pela lista de IDs (`orderedHeaderCols` das views) SEM mutar:
 * o resultado é sempre um array novo. IDs desconhecidos são ignorados; itens
 * fora da lista vão para o fim, na ordem original.
 */
export function reorderByIds<T extends { id: string }>(items: T[], orderedIds: string[]): T[] {
  if (orderedIds.length === 0) return items.slice()
  const byId = new Map(items.map((item) => [item.id, item]))
  const ordered = orderedIds
    .map((id) => byId.get(id))
    .filter((item): item is T => item !== undefined)
  const rest = items.filter((item) => !orderedIds.includes(item.id))
  return [...ordered, ...rest]
}
