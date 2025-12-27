import type { I_Vendor } from '../types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { Pencil, Trash2, Globe } from 'lucide-react';

interface VendorItemProps {
  vendor: I_Vendor;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const VendorItem = ({ vendor, onEdit, onDelete }: VendorItemProps) => {
  return (
    <li
      data-ui="vendor-item"
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* Placeholder for a logo, if we add one later */}
        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
          <span className="text-muted-foreground text-sm">{vendor.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{vendor.name}</p>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(vendor.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {vendor.website && (
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${vendor.name} website`}
          >
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Globe className="h-4 w-4" />
            </Button>
          </a>
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(vendor.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(vendor.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
};
