import { Link } from '@tanstack/react-router';
import { Tags } from 'lucide-react';

export const TagsCard = () => {
  return (
    <Link
      className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-5 text-foreground shadow-[var(--shadow-panel)] transition-[transform,border-color] hover:-translate-y-0.5 hover:border-brand/20"
      to="/tags"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-pastel-violet">
          <Tags className="h-5 w-5 text-brand" />
        </span>
        <span>
          <p className="text-sm font-semibold text-foreground">Tags</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Organize transactions and subscriptions
          </p>
        </span>
      </div>
      <span className="text-xs font-semibold text-brand">Manage</span>
    </Link>
  );
};
