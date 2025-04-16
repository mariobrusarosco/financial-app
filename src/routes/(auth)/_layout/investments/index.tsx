import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_layout/investments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/investments/"!</div>
}
