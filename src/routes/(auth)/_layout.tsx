import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-2 border border-red-500">
      <p>You are logged in</p>
      <Outlet />
    </div>
  )
}
