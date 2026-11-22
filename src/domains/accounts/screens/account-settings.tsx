import { useNavigate } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { AccountDetailsForm } from '@/domains/accounts/components/account-details-form';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import { useDeleteAccount } from '@/domains/accounts/hooks/use-delete-account';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { Button } from '@/domains/ui-system/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/domains/ui-system/components/dialog';

interface AccountSettingsScreenProps {
  slug: string;
}

export const AccountSettingsScreen = ({ slug }: AccountSettingsScreenProps) => {
  const navigate = useNavigate();
  const { data: account } = useAccount(slug);
  const deleteAccountMutation = useDeleteAccount(() => {
    void navigate({ to: '/accounts' });
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(slug);
  };

  return (
    <div className="space-y-6 pb-8" data-ui="account-settings-screen">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Account settings</h2>
        <p className="text-sm text-muted-foreground">Manage settings for this account.</p>
      </div>

      {account ? (
        // Keyed so the form resets if the page switches to another account
        <AccountDetailsForm key={account.id} account={account} />
      ) : (
        <Skeleton className="h-64 w-full rounded-2xl" />
      )}

      <section className="rounded-2xl border border-destructive/25 bg-card p-5 shadow-[var(--shadow-panel)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-destructive">Delete account</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete this account. This action cannot be undone.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="destructive">
                <Trash2 className="h-4 w-4" />
                Delete account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this account?</DialogTitle>
                <DialogDescription>
                  This action is permanent and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={deleteAccountMutation.isPending}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteAccountMutation.isPending}
                >
                  {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
};
