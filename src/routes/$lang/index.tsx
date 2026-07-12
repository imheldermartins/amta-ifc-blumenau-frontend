import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/pages/home/HomePage'

/** Rota inicial — vem antes das rotas públicas (sign-in/sign-up) e privadas (/app). */
export const Route = createFileRoute('/$lang/')({
  component: HomePage,
})
