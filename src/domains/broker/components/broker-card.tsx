import { MoreVertical, Trash2, Loader2 } from 'lucide-react';
import type { Broker } from '../type/types-and-interfaces';
import { useDeleteBroker } from '../hooks/use-delete-broker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui-system/components/dropdown-menu';

interface BrokerCardProps {
  broker: Broker;
}

const BrokerCard = ({ broker }: BrokerCardProps) => {
  const deleteBrokerMutation = useDeleteBroker();

  const handleDelete = () => {
    deleteBrokerMutation.mutate(broker.id);
  };

  return (
    <div className="relative aspect-square bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-700 cursor-pointer group hover:bg-rose-900/20">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2 transition-colors flex-1 pr-2">
          {broker.name}
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={e => e.stopPropagation()}
              className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              variant="destructive"
              onClick={e => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={deleteBrokerMutation.isPending}
              className="cursor-pointer"
            >
              {deleteBrokerMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {deleteBrokerMutation.isPending ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="h-full flex flex-col justify-between">
        <div className="flex-1 min-h-0">
          <p className="text-gray-400 text-sm mb-4">Investment Broker</p>
          {broker.description && (
            <p className="text-gray-300 text-sm line-clamp-3">{broker.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrokerCard;
