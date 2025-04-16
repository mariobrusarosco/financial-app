import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '~/domains/ui-system'

export const Route = createFileRoute('/(auth)/_layout/dashboard/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Summary of your financial accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Hello World! Welcome to your financial dashboard.</p>
            <Button>View Details</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">No recent transactions to display.</p>
            <Button variant="outline">View All</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Investment Summary</CardTitle>
            <CardDescription>Overview of your investment portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">No investments to display.</p>
            <Button variant="secondary">Manage Investments</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 