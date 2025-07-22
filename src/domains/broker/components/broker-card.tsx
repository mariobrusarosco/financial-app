import { MoreVertical, Trash2, Loader2, Building2 } from 'lucide-react';
import type { I_Broker } from '../type/types-and-interfaces';
import { useDeleteBroker } from '../hooks/use-delete-broker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/domains/ui-system/components/dropdown-menu';
import { Button } from '@/domains/ui-system/components/button';
import { Surface } from '@/domains/global/components/surface';

interface BrokerCardProps {
  broker: I_Broker;
}

const BrokerCard = ({ broker }: BrokerCardProps) => {
  const deleteBrokerMutation = useDeleteBroker();

  const handleDelete = () => {
    deleteBrokerMutation.mutate(broker.id);
  };

  return (
    <Surface
      className="h-32 w-full flex flex-col justify-between hover:bg-accent/50 transition-colors"
      size="sm"
      hoverable
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="p-2 rounded-full bg-primary/10">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{broker.name}</h3>
            <p className="text-sm text-muted-foreground">Investment Broker</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
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

      {broker.description && (
        <div className="mt-auto">
          <p className="text-sm text-muted-foreground line-clamp-2">{broker.description}</p>
        </div>
      )}
    </Surface>
  );
};

export default BrokerCard;
