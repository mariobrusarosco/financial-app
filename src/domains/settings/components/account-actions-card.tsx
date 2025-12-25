import { LogOut } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { useLogout } from '@/domains/auth/hooks/use-logout';

export const AccountActionsCard = () => {
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Actions</CardTitle>
        <CardDescription>Manage your account and session</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Sign Out</h3>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {logout.isPending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
