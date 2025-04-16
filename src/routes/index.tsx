import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Dashboard</h1>
      <p>Hello World! Welcome to your financial dashboard.</p>
    </div>
  )
}
