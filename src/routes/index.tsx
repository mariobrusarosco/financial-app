import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '~/domains/ui-system'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/dashboard',
      replace: true
    })
  },
})
