import { Icon } from '@iconify/react'

import type { ColumnDataType, HeaderCol, RowData } from '../types'
import { cx, formatCellValue, inferColumnType, resolveColumnWidth } from '../utils'

function CellValue({ type, value }: { type: ColumnDataType; value: unknown }) {
  if (type === 'checkbox') {
    return (
      <Icon
        icon={value ? 'lucide:square-check' : 'lucide:square'}
        fontSize={16}
        className={cx('shrink-0', value ? 'text-p-green' : 'opacity-40')}
      />
    )
  }
  if (type === 'select') {
    if (value === null || value === undefined || value === '') {
      return <span className="opacity-60">—</span>
    }
    return (
      <span className="rounded bg-active px-1.5 py-0.5 text-xs">{formatCellValue(value)}</span>
    )
  }
  return (
    <span className={cx('truncate', type === 'numeric' && 'tabular-nums')}>
      {formatCellValue(value)}
    </span>
  )
}

export interface TableCellProps {
  column: HeaderCol
  row: RowData
  /**
   * Tipo já resolvido no nível da tabela (`resolveColumnTypes`) — é o que o
   * header usou para o ícone. Sem ele, a célula resolve sozinha: type
   * declarado na coluna, senão inferido do PRÓPRIO valor.
   */
  columnType?: ColumnDataType
  /** Largura (px) vinda de `columnWidths` da view; ausente = default. */
  width?: number
}

/**
 * Célula: renderiza `cells[col.id].value` com o TIPO vindo da coluna — se ela
 * não declara um, o tipo é inferido dos valores. Quando a linha NÃO tem valor
 * para a coluna (`cells[col.id]` ausente), a célula vira um `div` vazio só
 * para preencher o espaço — mantém o alinhamento da grade sem exibir um valor
 * enganoso (ex.: o checkbox desmarcado, que pareceria um `false` real).
 *
 * A largura é FIXA (`shrink-0` + width em px), nunca elástica: com `flex-1` a
 * coluna dependeria de quantas células a linha tem, e uma linha sem valor para
 * a última coluna desalinhava da grade do header.
 */
export function TableCell({ column, row, columnType, width }: TableCellProps) {
  const cell = row.cells[column.id]
  const type = columnType ?? column.type ?? inferColumnType([cell?.value])

  return (
    <div
      role="cell"
      className="flex shrink-0 items-center border-l border-divider px-3 py-2 text-sm"
      style={{ width: resolveColumnWidth(width) }}
    >
      {cell ? (
        <CellValue type={type} value={cell.value} />
      ) : (
        // Preenche o box inteiro da célula: largura cheia + estica na altura da
        // linha, com uma linha de texto de altura mínima para não colapsar
        // mesmo numa linha em que todas as células estejam vazias.
        <div aria-hidden className="min-h-5 w-full self-stretch" />
      )}
    </div>
  )
}
