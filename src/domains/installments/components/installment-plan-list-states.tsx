import { Loader2, Calendar, Plus } from 'lucide-react';
import { PageHeader } from '@/domains/global/components';
import { Button } from '@/domains/ui-system/components/button';

export const LoadingState = () => (
  <div className="py-4 space-y-5 rounded-3xl h-full">
    <PageHeader
      title="Installment Plans"
      icon={Calendar}
      showAddButton={false}
    />
    <div className="flex items-center justify-center py-12 flex-1">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  </div>
);

export const ErrorState = () => (
  <div className="py-4 space-y-5 rounded-3xl">
    <PageHeader
      title="Installment Plans"
      icon={Calendar}
      showAddButton={false}
    />
    <div className="text-center py-12 text-destructive">
      <p>Failed to load installment plans.</p>
    </div>
  </div>
);

export const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="py-4 space-y-5 rounded-3xl">
    <PageHeader
      title="Installment Plans"
      icon={Calendar}
      onAdd={onAdd}
      addButtonLabel="Add Plan"
    />
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
      <div className="p-4 bg-muted/30 rounded-full">
        <Calendar className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-lg">No installment plans found</p>
        <p className="text-sm text-muted-foreground">
          Start by adding a new purchase split into installments to track your debt.
        </p>
      </div>
      <Button onClick={onAdd} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Create Plan
      </Button>
    </div>
  </div>
);