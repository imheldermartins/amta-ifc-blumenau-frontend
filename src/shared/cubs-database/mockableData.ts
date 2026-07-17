import type { DataViewSettings, HeaderCol, RowData } from './types'

export interface MockableDataset {
  tableName: string
  settings: DataViewSettings
  headerCols: HeaderCol[]
  rows: RowData[]
}

/** ULIDs fixos das views do mock (estáveis para deep-link/testes). */
export const MOCK_VIEW_IDS = {
  table: '01JZFM3T4V9GQ2W5X7Y8Z0ABCD',
  board: '01JZFM3T4VBH6K8M2N4P6Q8R0S',
  calendar: '01JZFM3T4VCX3Y5Z7A9B2C4D6E',
} as const

const COL = {
  title: 'col-title',
  slug: 'col-slug',
  status: 'col-status',
  published: 'col-published',
  order: 'col-order',
  updatedAt: 'col-updated-at',
} as const

/**
 * Dados simulados para desenvolvimento/preview. O dataset `pageTree` imita a
 * base do PageTree sem replicar a arquitetura literal: colunas dinâmicas
 * tipadas + o título (sem type → 'text'), que toda página tem.
 */
export const mockableData = {
  pageTree: {
    tableName: 'page_tree',
    settings: {
      [MOCK_VIEW_IDS.table]: {
        view: 'table',
        name: 'Tabela',
        filters: '',
        orderedHeaderCols: [COL.title, COL.slug, COL.status, COL.published, COL.order, COL.updatedAt],
      },
      [MOCK_VIEW_IDS.board]: {
        view: 'board',
        name: 'Board',
        filters: 'status=published',
        orderedHeaderCols: [],
      },
      [MOCK_VIEW_IDS.calendar]: {
        view: 'calendar',
        name: 'Calendário',
        filters: 'order=updated_at',
        orderedHeaderCols: [],
      },
    },
    headerCols: [
      // Título é o campo padrão de toda página: sem type (default 'text').
      { id: COL.title, title: 'Título', handle: { icon: 'lucide:maximize-2', name: 'Abrir' } },
      { id: COL.slug, title: 'Slug', type: 'text' },
      { id: COL.status, title: 'Status', type: 'select' },
      { id: COL.published, title: 'Publicada', type: 'checkbox' },
      { id: COL.order, title: 'Ordem', type: 'numeric' },
      { id: COL.updatedAt, title: 'Atualizada em', type: 'date' },
    ],
    rows: [
      {
        id: 'pg_01',
        cells: {
          [COL.title]: { value: 'Home' },
          [COL.slug]: { value: 'home' },
          [COL.status]: { value: 'Publicada' },
          [COL.published]: { value: true },
          [COL.order]: { value: 1 },
          [COL.updatedAt]: { value: '2026-07-10 09:12' },
        },
      },
      {
        id: 'pg_02',
        cells: {
          [COL.title]: { value: 'Documentação' },
          [COL.slug]: { value: 'docs' },
          [COL.status]: { value: 'Publicada' },
          [COL.published]: { value: true },
          [COL.order]: { value: 2 },
          [COL.updatedAt]: { value: '2026-07-11 14:40' },
        },
      },
      {
        id: 'pg_03',
        cells: {
          [COL.title]: { value: 'Primeiros passos' },
          [COL.slug]: { value: 'docs/getting-started' },
          [COL.status]: { value: 'Revisão' },
          [COL.published]: { value: true },
          [COL.order]: { value: 3 },
          [COL.updatedAt]: { value: '2026-07-12 08:05' },
        },
      },
      {
        id: 'pg_04',
        cells: {
          [COL.title]: { value: 'API' },
          [COL.slug]: { value: 'docs/api' },
          [COL.status]: { value: 'Rascunho' },
          [COL.published]: { value: false },
          [COL.order]: { value: 4 },
          [COL.updatedAt]: { value: '2026-07-13 17:22' },
        },
      },
      {
        id: 'pg_05',
        cells: {
          [COL.title]: { value: 'Blog' },
          [COL.slug]: { value: 'blog' },
          [COL.status]: { value: 'Publicada' },
          [COL.published]: { value: true },
          [COL.order]: { value: 5 },
          [COL.updatedAt]: { value: '2026-07-14 10:00' },
        },
      },
      {
        id: 'pg_06',
        cells: {
          [COL.title]: { value: 'Primeiro post' },
          [COL.slug]: { value: 'blog/primeiro-post' },
          [COL.status]: { value: 'Rascunho' },
          [COL.published]: { value: false },
          [COL.order]: { value: 6 },
          [COL.updatedAt]: { value: '2026-07-15 19:47' },
        },
      },
      {
        id: 'pg_07',
        cells: {
          [COL.title]: { value: 'Sobre' },
          [COL.slug]: { value: 'sobre' },
          [COL.status]: { value: 'Publicada' },
          [COL.published]: { value: true },
          [COL.order]: { value: 7 },
          [COL.updatedAt]: { value: '2026-07-15 21:30' },
        },
      },
      {
        id: 'pg_08',
        cells: {
          [COL.title]: { value: 'Contato' },
          [COL.slug]: { value: 'contato' },
          [COL.status]: { value: 'Publicada' },
          [COL.published]: { value: true },
          [COL.order]: { value: 8 },
          [COL.updatedAt]: { value: '2026-07-16 07:58' },
        },
      },
    ],
  },
} satisfies Record<string, MockableDataset>
