import { User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Separator } from '@/domains/ui-system/components/separator';

interface ProfileCardProps {
  user: {
    name: string;
    email: string;
  } | null;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>Your account details and preferences</CardDescription>
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
              <div variant="secondary">Active</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
