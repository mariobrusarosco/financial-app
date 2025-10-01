import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui-system/components/card';
import { Button } from '@ui-system/components/button';
import { Separator } from '@ui-system/components/separator';
import { Badge } from '@ui-system/components/badge';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { useLogout } from '@/domains/auth/hooks/use-logout';
import { User, LogOut, Settings as SettingsIcon } from 'lucide-react';

export const Route = createFileRoute('/(auth)/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Name</span>
                <span className="text-sm">{user.name}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account and session
          </CardDescription>
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

      {/* Future Settings Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <Badge variant="outline">System</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Manage how you receive notifications
                </p>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
