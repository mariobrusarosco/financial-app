import { useState } from 'react';
import type { FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { I_Account } from '@/domains/accounts/types/types-and-interfaces';
import { useUpdateAccount } from '@/domains/accounts/hooks/use-update-account';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import { Textarea } from '@/domains/ui-system/components/textarea';

interface AccountDetailsFormProps {
  account: I_Account;
}

export const AccountDetailsForm = ({ account }: AccountDetailsFormProps) => {
  const [name, setName] = useState(account.name);
  const [description, setDescription] = useState(account.description ?? '');
  const updateAccount = useUpdateAccount();

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const isDirty =
    trimmedName !== account.name || trimmedDescription !== (account.description ?? '');
  const nameError = trimmedName ? null : 'Account name is required';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (nameError || !isDirty) return;

    updateAccount.mutate({
      accountId: account.id,
      payload: { name: trimmedName, description: trimmedDescription || null },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-panel)] sm:p-6"
      data-ui="account-details-form"
    >
      <div>
        <h3 className="font-semibold text-foreground">Account details</h3>
        <p className="text-sm text-muted-foreground">
          Currency and broker can&apos;t be changed after the account is created.
        </p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="account-name">Name</Label>
          <Input
            id="account-name"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-invalid={!!nameError}
          />
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        </div>

        <div className="space-y-2">
          <Label>Broker · Currency</Label>
          <p className="flex h-10 items-center text-sm text-muted-foreground">
            {account.broker?.name ?? '—'} · {account.currency}
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="account-description">Description</Label>
          <Textarea
            id="account-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional notes about this account"
            className="min-h-20"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        {isDirty && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setName(account.name);
              setDescription(account.description ?? '');
            }}
            disabled={updateAccount.isPending}
          >
            Discard
          </Button>
        )}
        <Button type="submit" disabled={!isDirty || !!nameError || updateAccount.isPending}>
          {updateAccount.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {updateAccount.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
};
