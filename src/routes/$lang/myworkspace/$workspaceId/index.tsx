import { createFileRoute } from '@tanstack/react-router'

import { AppHomePage } from '@/pages/app/AppHomePage'

export const Route = createFileRoute('/$lang/myworkspace/$workspaceId/')({
  component: AppHomePage,
})
