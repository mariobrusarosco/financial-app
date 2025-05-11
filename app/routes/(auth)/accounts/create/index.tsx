import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/accounts/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/accounts/create/"!</div>
}
