import { Link } from '@tanstack/react-router';
import { CreditCard, Plus, WalletCards } from 'lucide-react';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';
import { Button } from '@/domains/ui-system/components/button';
import { Skeleton } from '@/domains/ui-system/components/skeleton';

interface AccountCreditCardsScreenProps {
  params: {
    slug: string;
  };
}

export const AccountCreditCardsScreen = ({ params }: AccountCreditCardsScreenProps) => {
  const { openCreditCardCreate } = useGlobalUIState();
  const creditCardsQuery = useCreditCards(params.slug);
  const creditCards = creditCardsQuery.data?.data ?? [];

  return (
    <section
      className="rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-panel)]"
      data-ui="account-credit-cards-screen"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.025em] text-foreground">
            Credit cards
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Cards associated with this account</p>
        </div>
        <Button onClick={openCreditCardCreate}>
          <Plus className="h-4 w-4" />
          New card
        </Button>
      </div>

      {creditCardsQuery.isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[1.58/1] w-full rounded-3xl" />
          ))}
        </div>
      ) : creditCardsQuery.error ? (
        <div className="mt-6 flex min-h-48 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
          We couldn&apos;t load your credit cards.
        </div>
      ) : creditCards.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {creditCards.map(creditCard => (
            <li key={creditCard.id}>
              <Link
                to="/accounts/$slug/credit-card/$creditCardId"
                params={{ slug: params.slug, creditCardId: creditCard.id }}
                className="group relative block aspect-[1.58/1] overflow-hidden rounded-3xl bg-[#1f4ae0] p-5 text-white shadow-lg shadow-brand/15 transition-transform hover:-translate-y-1"
              >
                <span className="absolute -top-14 -right-12 h-44 w-44 rounded-full border-[32px] border-white/10" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-white/65">Credit limit</p>
                      <p className="financial-value mt-1 text-lg font-semibold">
                        {formatCurrencyAmount(creditCard.credit_limit)}
                      </p>
                    </div>
                    <WalletCards className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <p className="font-mono text-sm tracking-[0.18em] text-white/90">
                      •••• •••• •••• {creditCard.last_four_digits}
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{creditCard.name}</p>
                        <p className="mt-0.5 text-xs text-white/60">
                          Due day {creditCard.due_date}
                        </p>
                      </div>
                      <span className="text-xs font-semibold capitalize">{creditCard.brand}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <button
          type="button"
          onClick={openCreditCardCreate}
          className="mt-6 flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand/30 bg-pastel-blue/40 p-6 text-center transition-colors hover:bg-pastel-blue/70"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-card text-brand shadow-sm">
            <CreditCard className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">No cards yet</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Add a card to track invoices and transactions.
            </span>
          </span>
        </button>
      )}
    </section>
  );
};
