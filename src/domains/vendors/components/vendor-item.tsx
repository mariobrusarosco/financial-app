import type { I_Vendor } from '@/domains/vendors/types/types-and-interfaces';
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
      className="flex min-h-24 items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] transition-[transform,border-color] hover:-translate-y-0.5 hover:border-brand/20"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pastel-blue">
          <span className="text-sm font-semibold text-brand">
            {vendor.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-foreground">{vendor.name}</p>
          <p className="text-xs text-muted-foreground">
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
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(vendor.id)}>
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
