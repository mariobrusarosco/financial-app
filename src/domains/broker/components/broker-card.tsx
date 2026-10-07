import { MoreVertical, Trash2, Loader2 } from 'lucide-react';
import type { I_Broker } from '@/domains/broker/type/types-and-interfaces';
import { useDeleteBroker } from '@/domains/broker/hooks/use-delete-broker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/domains/ui-system/components/dropdown-menu';
import { Button } from '@/domains/ui-system/components/button';

interface BrokerCardProps {
  broker: I_Broker;
}

const BrokerCard = ({ broker }: BrokerCardProps) => {
  const deleteBrokerMutation = useDeleteBroker();

  const handleDelete = () => {
    deleteBrokerMutation.mutate(broker.id);
  };

  const brokerPrimaryColor = broker.colors[0];

  return (
    <div
      className="relative flex min-h-40 w-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-panel)]"
      data-testid="broker-card"
      data-ui="broker-card"
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: brokerPrimaryColor }}
      />
      <div className="flex items-start justify-between px-5 py-5">
        <h3
          data-testid="broker-card-name"
          className="truncate text-sm font-semibold text-foreground"
        >
          {broker.name}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-testid="broker-card-menu"
              className="h-8 w-8 text-muted-foreground"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              data-testid="broker-delete-button"
              onClick={e => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={deleteBrokerMutation.isPending}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              {deleteBrokerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {deleteBrokerMutation.isPending ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-border/70 bg-muted/35 px-5 py-4">
        <p
          data-testid="broker-card-description"
          className="line-clamp-2 text-sm text-muted-foreground"
        >
          {broker.description || 'Investment Broker'}
        </p>
      </div>
    </div>
  );
};

export default BrokerCard;
