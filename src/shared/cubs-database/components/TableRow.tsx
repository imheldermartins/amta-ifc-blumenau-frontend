import { Icon } from '@iconify/react'

import type { HeaderCol, RowData } from '../types'
import { cx } from '../utils'
import { TableCell } from './TableCell'

/** Largura da célula de controles — o header usa o MESMO valor para alinhar. */
export const CONTROL_CELL_WIDTH = 'w-32'

export interface TableRowLabels {
  drag?: string
  select?: string
  /** Label do botão de abrir a página (ex.: "Abrir"). */
  open?: string
}

export interface TableRowProps {
  row: RowData
  columns: HeaderCol[]
  /** true = linha "listrada" (bg-contrast); false = bg-background. */
  zebra: boolean
  selected: boolean
  onSelectedChange: (checked: boolean) => void
  /** Clique no botão "Abrir ›" da célula de controles — recebe a row crua. */
  onOpenRow?: (row: RowData) => void
  labels?: TableRowLabels
}

/**
 * Linha da tabela em zebra striping — linhas contíguas, não cards. A PRIMEIRA
 * célula é estática (posição zero, dentro da zebra) e carrega os controles:
 * drag-handle + checkbox + botão "Abrir ›"; aparecem no hover da linha e
 * ficam fixos quando ela está selecionada.
 */
export function TableRow({ row, columns, zebra, selected, onSelectedChange, onOpenRow, labels }: TableRowProps) {
  return (
    <div
      role="row"
      className={cx('group/row flex items-stretch', zebra ? 'bg-contrast' : 'bg-background')}
    >
      <div
        role="cell"
        className={cx(
          'flex shrink-0 items-center gap-1 px-2 py-1.5',
          CONTROL_CELL_WIDTH,
          'transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100 focus-within:opacity-100',
        )}
      >
        <button
          type="button"
          aria-label={labels?.drag ?? 'Arrastar linha'}
          className="cursor-grab rounded p-1 opacity-60 transition-colors hover:bg-active hover:opacity-100"
        >
          <Icon icon="lucide:grip-vertical" fontSize={15} />
        </button>
        <input
          type="checkbox"
          aria-label={labels?.select ?? 'Selecionar linha'}
          checked={selected}
          onChange={(event) => onSelectedChange(event.target.checked)}
          className="size-4 cursor-pointer accent-p-purple-600"
        />
        <button
          type="button"
          onClick={() => onOpenRow?.(row)}
          className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs opacity-70 transition-colors hover:bg-active hover:opacity-100"
        >
          {labels?.open ?? 'Abrir'}
          <Icon icon="lucide:chevron-right" fontSize={13} className="shrink-0" />
        </button>
      </div>

      {columns.map((column) => (
        <TableCell key={column.id} column={column} row={row} />
      ))}
    </div>
  )
}
