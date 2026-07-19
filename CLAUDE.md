# CLAUDE.md — Frontend do Cub's

Guia de convenções para trabalhar neste repositório. Detalhes de setup e
arquitetura estão no [README.md](README.md).

## Comandos

- `npm run dev` — dev server (Vite) em http://localhost:5173
- `npm run build` — `tsc -b` + build de produção
- `npm run lint` — oxlint

Após criar/mover rotas ou adicionar classes Tailwind NOVAS, o dev server em
execução às vezes não regenera; valide com `npm run build` (ou reinicie o dev).

## Arquitetura

Frontend (:5173) → **cubs-backend** (Express, :3000) → **rqlite** (:8000, dev).
O frontend fala com a API do backend (rotas `/auth`, `/users`, ...), nunca com
o rqlite direto. API HTTP e socket.io são o MESMO servidor
(`src/lib/connection.ts`). Em dev, sem env definida, tudo passa pelo proxy do
Vite (`API_BASE_PATH` e `/socket.io` → :3000); em prod, o nginx do container
faz esse papel (`nginx/nginx.conf`, porta 80 — ver `Dockerfile` e o compose de
prod em `cubs-backend/docker/docker-compose.prod.yml`).

**O `/api` é REAL nos dois lados** — o backend monta todos os routers sob `/api`
(`API_PREFIX` em `cubs-backend/src/core/http/http-server.ts`) e os mediadores
(Vite em dev, nginx em prod) repassam o path INTACTO, sem reescrever. O prefixo
ainda serve para o proxy separar chamada de API de rota da SPA na mesma origem,
mas não morre ali. Os services pedem o path direto (`/pages/:id`) porque quem
prende o prefixo é o `baseURL` do axios — que termina em `/api` inclusive
quando `VITE_CUBS_API_URL` aponta direto para o backend. Valor único em
`API_BASE_PATH` (`src/constants/api.ts`), com o `nginx.conf` espelhando na mão.
O `/socket.io` fica FORA do prefixo (raiz do backend).

## Base de dados (CubsDatabase)

O backend modela páginas como **árvore recursiva** (`page_edges`: parent →
child): não existe página "raiz" como tipo. Uma base/tabela é só uma página
cujas FILHAS são as linhas — a mesma página é filha num nível e parent no
seguinte. A workspace só resolve o **ponto de entrada**
(`/workspaces/:id/page_root`, GET-or-create); daí para baixo é página → página,
e o que muda é apenas o id.

- `src/services/DatabaseService.ts` — I/O. A unidade é `loadPage(pageId)` (as 3
  leituras da página em paralelo); `loadWorkspace(workspaceId)` é o caso
  particular que resolve o id de entrada e delega. Nada assume workspace única:
  `FIXED_WORKSPACE_ID` é TEMPORÁRIO, até existir o contexto de workspace.
- `src/lib/databaseParser.ts` — adaptador API → modelo da lib `cubs-database`,
  puro e testável. A lib é agnóstica ao backend de propósito, então a tradução
  mora só aqui. O que ele resolve, e que não é óbvio:
  - `pages.title` não é uma coluna — vira a coluna sintética `TITLE_COLUMN_ID`
    (`page_title`), sempre a primeira;
  - `select` guarda o **ULID da option**, não o texto: sem traduzir pelas
    `options` da coluna, a célula mostraria o ULID cru;
  - valores vêm no envelope `{"value":<T>}` **como string JSON**, e o
    `column_data` do dataset também;
  - as colunas saem de `/pages/parent/:id/columns`, NUNCA do dataset — o JOIN
    dele parte dos valores, então coluna ainda sem valor não apareceria;
  - `pages.data` guarda as views (`{ [ulid]: view }`); entrada com formato
    inesperado é descartada, e base sem view cai num fallback de id FIXO.

## Convenções

- **Dependências**: sempre versão exata (`npm install --save-exact`, sem `^`/`~`).
- **i18n**: TODO texto de tela passa por `i18n('pages.secao.chave')`
  (`src/lib/i18n.ts`); traduções em `src/locales/pt-br.json`. Nada de string
  solta em componente.
- **Nomes**: funções `camelCase`; Components/Services/Sections `PascalCase`;
  rotas kebab-case.
- **Aliases**: `@/*`, `@components`, `@contexts`, `@locales`.
- **Classes**: componha com `cn` (`src/lib/utils.ts`). O Tailwind só gera
  classe que aparece **escrita por extenso** no código — nada de
  `bg-${cor}-600` montado em runtime.

## Tema e design tokens

- `src/index.css` tem SÓ a base: `background`, `contrast`, `active`, `divider`,
  `divider-contrast`, `foreground` (valores via `theme(--color-zinc-*)`) +
  `--font-sans` (Noto Sans). **Sem tokens por-componente.** Adicionar um token
  de cor = 2 passos: (1) definir `--x` em `:root` e `.dark`; (2) registrar
  `--color-x: var(--x)` em `@theme inline` (é isso que gera `bg-x`, `text-x`, ...).
- **Cores de destaque = utilitários nativos `p-*`** (definidos em `index.css`):
  os nomes semânticos mapeiam para hues (`red→rose`, `blue→blue`,
  `purple→violet`, `green→emerald`). Use direto no `className`, sem importar
  nada:
  - Tom cheio, theme-aware: `bg-p-red`, `text-p-red`, `border-p-red`,
    `shadow-p-red` (600 no light / 500 no dark). `shadow-p-red` só dá a COR —
    combine com um tamanho (`shadow-xl shadow-p-red`).
  - Escala completa p/ controle fino: `bg-p-red-500`, `text-p-red-600
    dark:text-p-red-400`, `shadow-p-red-600/20 dark:shadow-p-red-500/20`, etc.
  - `src/lib/palette.ts` (`PALETTE`) é só para cor **dinâmica por prop**
    (`<Button color={cor} />`) — compõe as mesmas classes `p-*`. Para cor fixa,
    prefira os utilitários e NÃO importe `PALETTE`. Filled colorido usa texto
    branco (`text-white`).
- `src/components/Typography.tsx` — todo texto usa variants (`h1`..`caption`).

## Componentes dual-mode (form OU state)

Os componentes de formulário funcionam nos **dois fluxos**, e a escolha é pela
presença da prop `name`:

- **`name` presente → modo FORM** (react-hook-form): o componente se registra
  sozinho no `<FormProvider>` acima (estado, validação e erro vêm do form).
- **sem `name` → modo STATE**: componente controlado comum (`value`/`onChange`
  ou `checked`/`onCheckedChange`), com erro via prop.

```tsx
// TextField
<TextField name="cpf" label="CPF" mask="cpf" rules={validators.cpf()} />        // form
<TextField label="Busca" value={q} onChange={(e) => setQ(e.target.value)} />     // state

// Switch
<Switch name="aceito" label="Aceito os termos" />                                // form
<Switch checked={dark} onCheckedChange={setDark} label="Modo escuro" />          // state
```

Ao criar um componente de campo novo, siga o mesmo padrão: um `*View`
controlado + um wrapper de form (`useController`/`register`) + um público que
decide por `name`. Modo form exige `<FormProvider>` acima.

## Verificação

Ao mudar UI, verifique no browser. Cuidado: no browser pane embutido as
**transições CSS congelam** (`currentTime: 0`) — para ler o estado final de algo
animado, desligue a transição (`element.style.transition = 'none'`) ou cheque
`getAnimations()`.
