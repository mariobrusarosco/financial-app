import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '~/domains/ui-system'

export const Route = createFileRoute('/(auth)/_layout/investments/')({
  component: Investments,
})

function Investments() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Investments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Investment Portfolio</CardTitle>
            <CardDescription>Overview of your investment assets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Hello World! Your investment dashboard is coming soon.</p>
            <Button>Add Investment</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Track the performance of your investments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Performance tracking will be available soon.</p>
            <Button variant="outline">View Details</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Investment History</CardTitle>
          <CardDescription>Track all your investment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">No investment history to display.</p>
          <Button variant="secondary">Export History</Button>
        </CardContent>
      </Card>
    </div>
  )
}
