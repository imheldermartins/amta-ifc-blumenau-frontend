export { CubsDatabase } from './CubsDatabase'
export type { CubsDatabaseProps } from './CubsDatabase'

export { ViewTabsBar } from './components/ViewTabsBar'
export type { ViewTabsBarProps } from './components/ViewTabsBar'
export { TableView } from './components/TableView'
export type { TableViewProps } from './components/TableView'
export { TableRow } from './components/TableRow'
export type { TableRowLabels, TableRowProps } from './components/TableRow'
export { TableCell } from './components/TableCell'
export type { TableCellProps } from './components/TableCell'

export type {
  CellData,
  ColumnDataType,
  DataViewKind,
  DataViewSettings,
  DataViewType,
  HeaderCol,
  RowData,
} from './types'

/**
 * `ContextMenuItem` mora em `cubs-components` (junto do componente), mas é
 * re-exportado aqui porque `CubsDatabaseProps.viewMenuItems` o usa — quem
 * consome esta lib precisa do tipo para montar a prop.
 */
export type { ContextMenuItem } from 'cubs-components'

export {
  formatCellValue,
  inferColumnType,
  reorderByIds,
  resolveColumnTypes,
  resolveColumnWidth,
  ulid,
  DEFAULT_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  MAX_COLUMN_WIDTH,
} from './utils'
export { mockableData, MOCK_VIEW_IDS } from './mockableData'
export type { MockableDataset } from './mockableData'
export { CUBS_DATABASE_VERSION } from './version'
