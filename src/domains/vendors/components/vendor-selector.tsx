import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { Button } from '@/domains/ui-system/components/button';
import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@/domains/ui-system/utils';
import type { I_Vendor } from '../types/types-and-interfaces';

interface VendorSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  vendors: I_Vendor[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'default' | 'sm';
}

export const VendorSelector = ({
  value,
  onValueChange,
  vendors,
  placeholder = 'Select Vendor',
  className,
  disabled = false,
  size = 'default',
}: VendorSelectorProps) => {
  const navigate = useNavigate();

  const handleCreateVendor = () => {
    (navigate as any)({ search: (prev: any) => ({ ...prev, drawer: 'vendor-create' }) });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger className={cn('w-full', className)} size={size}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {vendors.map(vendor => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn('shrink-0', size === 'sm' ? 'h-8 w-8' : 'h-9 w-9')}
        onClick={handleCreateVendor}
        disabled={disabled}
        title="Create New Vendor"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
