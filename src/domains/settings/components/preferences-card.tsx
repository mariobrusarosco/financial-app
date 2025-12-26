import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Separator } from '@/domains/ui-system/components/separator';
import { Badge } from '@/domains/ui-system/components/badge';
import { ModeToggle } from '@/domains/ui-system/components/mode-toggle';

export const PreferencesCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your app experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <ModeToggle />
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
  );
};
