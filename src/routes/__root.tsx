import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      {/* Excluído automaticamente dos builds de produção. */}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
