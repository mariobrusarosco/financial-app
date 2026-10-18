import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Landmark,
  Loader2,
} from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { cn } from '@/domains/ui-system/utils';
import { useCashflowViewGroupTransactions } from '@/domains/cashflow/hooks/use-cashflow-views';
import type {
  I_CashflowViewGroupResponse,
  I_CashflowViewGroupTransactionResponse,
  I_CashflowViewReportParams,
} from '@/domains/cashflow/types/index';
import { formatCashflowCurrency } from '@/domains/cashflow/utils/cashflow-formatting';

const PAGE_SIZE = 10;

interface CashflowViewGroupProps {
  viewId: string;
  // Omit for the "Not in any group" line
  group?: I_CashflowViewGroupResponse;
  total: number;
  count: number;
  // Bar length relative to the largest group in the view (0–100)
  barWidth: number;
  params: I_CashflowViewReportParams;
}

/**
 * One line per group (expenses with ALL its tags), or the "Not in any group" line when `group`
 * is omitted. Expands into its expenses.
 */
export const CashflowViewGroup = ({
  viewId,
  group,
  total,
  count,
  barWidth,
  params,
}: CashflowViewGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = `cashflow-view-group-${group?.id ?? 'ungrouped'}`;

  return (
    <li className="rounded-lg">
      <button
        type="button"
        onClick={() => setIsExpanded(current => !current)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        disabled={count === 0}
        className="block w-full space-y-1.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/50 disabled:cursor-default disabled:hover:bg-transparent"
      >
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-1.5">
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                isExpanded && 'rotate-180',
                count === 0 && 'invisible'
              )}
            />
            <span
              className={cn(
                'truncate font-semibold',
                group ? 'text-primary' : 'italic text-muted-foreground'
              )}
            >
              {group?.name ?? 'Not in any group'}
            </span>
          </span>
          <span className="shrink-0 font-semibold text-destructive">
            {formatCashflowCurrency(total)}
          </span>
        </div>
        <div className="flex items-center gap-3 pl-5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                group ? 'bg-destructive/60' : 'bg-muted-foreground/40'
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
            {count} {count === 1 ? 'transaction' : 'transactions'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div id={panelId} className="pb-2 pl-7 pr-2">
          <GroupTransactions viewId={viewId} group={group} params={params} />
        </div>
      )}
    </li>
  );
};

const GroupTransactions = ({
  viewId,
  group,
  params,
}: {
  viewId: string;
  group?: I_CashflowViewGroupResponse;
  params: I_CashflowViewReportParams;
}) => {
  const [page, setPage] = useState(1);
  const query = useCashflowViewGroupTransactions(viewId, group?.id ?? null, {
    ...params,
    page,
    per_page: PAGE_SIZE,
  });

  if (query.isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading expenses…
      </div>
    );
  }

  if (query.isError || !query.data) {
    return <p className="py-3 text-sm text-destructive">Couldn&apos;t load these expenses.</p>;
  }

  const { data: transactions, meta } = query.data;

  return (
    <div className={cn('space-y-2', query.isPlaceholderData && 'opacity-60')}>
      <ul className="divide-y rounded-lg border">
        {transactions.map(transaction => (
          <CompactTransaction key={transaction.id} transaction={transaction} />
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        {/* "Not in any group" can't be expressed as a Transactions filter */}
        {group ? (
          <Link
            to="/transactions"
            search={{
              tag_ids: group.tag_ids,
              tag_match: 'all',
              movement_type: 'expense',
              date_from: params.date_from,
              date_to: params.date_to,
            }}
            className="font-medium text-brand hover:underline"
          >
            Open in Transactions
          </Link>
        ) : (
          <span />
        )}

        {(meta.has_previous || meta.has_next) && (
          <div className="flex items-center gap-1">
            <span className="mr-1">
              {(meta.page - 1) * meta.per_page + 1}–
              {Math.min(meta.page * meta.per_page, meta.total)} of {meta.total}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage(current => current - 1)}
              disabled={!meta.has_previous}
              aria-label="Previous expenses"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage(current => current + 1)}
              disabled={!meta.has_next}
              aria-label="Next expenses"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const CompactTransaction = ({
  transaction,
}: {
  transaction: I_CashflowViewGroupTransactionResponse;
}) => {
  const source = transaction.credit_card ?? transaction.account;
  const SourceIcon = transaction.credit_card ? CreditCard : Landmark;

  return (
    <li className="flex items-center gap-3 px-3 py-2 text-sm">
      <span className="w-12 shrink-0 text-xs text-muted-foreground">
        {format(parseISO(transaction.date), 'dd MMM')}
      </span>
      <span className="min-w-0 flex-1 truncate">{transaction.description}</span>
      {source && (
        <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
          <SourceIcon className="h-3 w-3" />
          {source.name}
        </span>
      )}
      <span className="shrink-0 font-medium">
        {formatCashflowCurrency(Number(transaction.amount))}
      </span>
    </li>
  );
};
