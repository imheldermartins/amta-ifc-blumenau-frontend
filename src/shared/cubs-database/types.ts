/**
 * Tipos públicos da lib.
 *
 * A visualização é orientada a "views" (settings): um Record cuja CHAVE é um
 * ULID e o valor descreve como exibir os mesmos dados (tabela, board, ...).
 * Os tipos de célula espelham os tipos de coluna usados no sistema — a lib
 * define os seus próprios, sem referência direta ao backend.
 */

/** Tipos de dado que uma coluna pode ter. */
export type ColumnDataType = 'text' | 'numeric' | 'select' | 'date' | 'checkbox'

/** Modos de visualização disponíveis (só 'table' implementado por enquanto). */
export type DataViewKind = 'table' | 'board' | 'calendar'

/** Uma view salva: como exibir os dados. */
export interface DataViewType {
  view: DataViewKind
  /** Nome exibido na tab da topbar. */
  name: string
  /**
   * Filtros serializados como string — o objetivo é, no futuro, fazer parsing
   * direto para a query da URL (ex.: `status=published&depth=0`).
   */
  filters: string
  /**
   * Ordem de exibição como lista de IDs de coluna. Reordenar = produzir um
   * NOVO array (slice/spread), nunca mexer em índices na mão. Vazio = usa a
   * ordem natural de `headerCols`.
   */
  orderedHeaderCols: string[]
}

/** Conjunto de views: chave = ULID da view. */
export type DataViewSettings = Record<string, DataViewType>

/** Dados de uma linha: as células são indexadas pelo ID da coluna. */
export interface RowData {
  id: string
  cells: Record<string, CellData>
}

/** Célula sempre no formato `{ value }`; o TIPO vem da coluna, não da célula. */
export interface CellData {
  value: unknown
}

/** Definição de coluna. A ordem do array já é a ordem de display (esq→dir). */
export interface HeaderCol {
  id: string
  title: string
  /** Ausente = 'text' (caso do título da página, que toda página tem). */
  type?: ColumnDataType
}

/** Item do ContextMenu (aberto com botão DIREITO do mouse). */
export interface ContextMenuItem {
  id: string
  label: string
  icon?: string
  danger?: boolean
  onSelect?: () => void
}
