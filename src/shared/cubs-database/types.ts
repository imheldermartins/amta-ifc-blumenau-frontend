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
  /**
   * Largura das colunas EM PIXELS, indexada pelo ID da coluna. Mora na VIEW e
   * não na coluna de propósito: largura é apresentação, então a mesma coluna
   * pode ser larga numa view e estreita em outra — e é aqui que o resize de
   * coluna vai persistir. Coluna ausente = `DEFAULT_COLUMN_WIDTH`; valores
   * fora da faixa são clampados por `resolveColumnWidth`.
   */
  columnWidths?: Record<string, number>
}

/** Conjunto de views: chave = ULID da view. */
export type DataViewSettings = Record<string, DataViewType>

/**
 * Dados de uma linha: as células são indexadas pelo ID da coluna. Nem toda
 * página tem valor para toda coluna, então a célula pode estar AUSENTE — o
 * acesso `cells[id]` é `CellData | undefined` e quem renderiza trata o vazio.
 */
export interface RowData {
  id: string
  cells: Record<string, CellData | undefined>
}

/** Célula sempre no formato `{ value }`; o TIPO vem da coluna, não da célula. */
export interface CellData {
  value: unknown
}

/** Definição de coluna. A ordem do array já é a ordem de display (esq→dir). */
export interface HeaderCol {
  id: string
  title: string
  /**
   * Ausente = INFERIDO dos valores da coluna (`inferColumnType`). A lib não
   * assume nada sobre por que o type falta — se a base tem colunas sem type
   * declarado, isso é regra de negócio de quem monta os dados, e a tabela só
   * precisa saber como desenhar a célula.
   */
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
