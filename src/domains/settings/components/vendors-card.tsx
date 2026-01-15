import { Link } from '@tanstack/react-router';
import { Store } from 'lucide-react';

export const VendorsCard = () => {
  return (
    <Link
      className="text-primary bg-neutral-white rounded-3xl p-4 inline-flex items-center gap-4"
      to="/vendors"
    >
      <div className="flex items-center gap-4">
        <span className="p-32bg-foreground/20 rounded-lg">
          <Store className="h-5 w-5 text-primary" />
        </span>
        <p className="text-lg text-primary font-light tracking-tight">Vendors</p>
      </div>
    </Link>
  );
};
