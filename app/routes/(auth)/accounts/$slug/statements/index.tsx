import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/accounts/$slug/statements/')({
  component: StatementsRouteComponent,
})

function StatementsRouteComponent() {
  // Access the slug param from the route
  const { slug } = Route.useParams()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Statements for Account: {slug}</h1>
      <p>This is where the statements for account <b>{slug}</b> will be displayed.</p>
    </div>
  )
}
