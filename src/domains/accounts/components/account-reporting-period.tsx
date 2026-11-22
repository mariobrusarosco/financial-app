import { GlobalDateFilter } from '@/domains/global/components/global-date-filter';

// Shown only on the tabs whose data follows the from/to range in the URL
const AccountReportingPeriod = ({ description }: AccountReportingPeriodProps) => (
  <div
    className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] lg:flex-row lg:items-center lg:justify-between"
    data-ui="account-reporting-period"
  >
    <div>
      <h2 className="text-sm font-semibold text-foreground">Reporting period</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
    <GlobalDateFilter />
  </div>
);

export default AccountReportingPeriod;

interface AccountReportingPeriodProps {
  description: string;
}
