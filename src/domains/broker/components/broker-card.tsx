import { MoreVertical, Trash2, Loader2 } from 'lucide-react';
import type { I_Broker } from '../type/types-and-interfaces';
import { useDeleteBroker } from '../hooks/use-delete-broker';
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
      className="w-full flex flex-col gap-4 justify-between bg-card-background rounded-3xl"
      data-ui="broker-card"
    >
      <div className="flex items-start justify-between px-6 py-5">
        <div className="">
          <h3 className="text-xl truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {broker.name}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              style={{ backgroundColor: brokerPrimaryColor }}
              className="text-neutral-white rounded-lg p-2"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </button>
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

      <div className="rounded-b-3xl px-6 py-8" style={{ backgroundColor: brokerPrimaryColor }}>
        <p className="font-light text-neutral-white text-base tracking-tight line-clamp-2">
          {broker.description || 'Investment Broker'}
        </p>
      </div>
    </div>
  );
};

export default BrokerCard;
