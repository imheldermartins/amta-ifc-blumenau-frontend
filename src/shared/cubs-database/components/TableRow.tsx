import { Icon } from '@iconify/react'
import { Checkbox, cn } from 'cubs-components'

import type { ColumnDataType, HeaderCol, RowData } from '../types'
import { TableCell } from './TableCell'

/** Largura da célula de controles — o header usa o MESMO valor para alinhar. */
export const CONTROL_CELL_WIDTH = 'w-24'

export interface TableRowLabels {
  drag?: string
  select?: string
  /** Label do botão de abrir a página (ex.: "Abrir"). */
  open?: string
}

export interface TableRowProps {
  row: RowData
  columns: HeaderCol[]
  /** `columnWidths` da view (px por ID de coluna) — o header usa o MESMO mapa. */
  columnWidths?: Record<string, number>
  /** Tipos resolvidos por ID de coluna — o header usa o MESMO mapa. */
  columnTypes?: Record<string, ColumnDataType>
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
export function TableRow({ row, columns, columnWidths, columnTypes, zebra, selected, onSelectedChange, onOpenRow, labels }: TableRowProps) {
  return (
    <div
      role="row"
      className={cn(
        'group/row flex w-max min-w-full items-stretch',
        zebra ? 'bg-contrast' : 'bg-background',
      )}
    >
      <div
        role="cell"
        className={cn(
          'flex shrink-0 items-center gap-1',
          CONTROL_CELL_WIDTH,
          'transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100 focus-within:opacity-100',
        )}
      >
        <button
          type="button"
          aria-label={labels?.drag ?? 'Arrastar linha'}
          className="cursor-grab rounded px-0.5 py-1 opacity-60 transition-colors hover:bg-active hover:opacity-100"
        >
          <Icon icon="lucide:grip-vertical" />
        </button>
        <Checkbox
          aria-label={labels?.select ?? 'Selecionar linha'}
          checked={selected}
          onCheckedChange={onSelectedChange}
          className="cursor-pointer"
        />
        <button
          type="button"
          onClick={() => onOpenRow?.(row)}
          className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs opacity-70 transition-colors hover:opacity-100 cursor-pointer"
        >
          {labels?.open ?? 'Abrir'}
          <Icon icon="lucide:chevron-right" className="shrink-0" />
        </button>
      </div>

      {columns.map((column) => (
        <TableCell
          key={column.id}
          column={column}
          row={row}
          columnType={columnTypes?.[column.id]}
          width={columnWidths?.[column.id]}
        />
      ))}
    </div>
  )
}
