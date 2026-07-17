import { Icon } from '@iconify/react'

import type { ColumnDataType, HeaderCol, RowData } from '../types'
import { cx, formatCellValue } from '../utils'

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
}

/**
 * Célula: renderiza sempre `cells[col.id].value`, com o TIPO vindo da coluna
 * (ausente = 'text').
 */
export function TableCell({ column, row }: TableCellProps) {
  const type = column.type ?? 'text'
  const cell = row.cells[column.id]

  return (
    <div role="cell" className="flex min-w-36 flex-1 items-center px-3 py-2 text-sm">
      <CellValue type={type} value={cell?.value} />
    </div>
  )
}
