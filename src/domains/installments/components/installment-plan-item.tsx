import { useState } from 'react';
import type { I_InstallmentPlan } from '../types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { Pencil, Trash2, Calendar, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/domains/ui-system/utils';
import { Badge } from '@/domains/ui-system/components/badge';
import { useNavigate } from '@tanstack/react-router';

interface InstallmentPlanItemProps {
  plan: I_InstallmentPlan;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InstallmentPlanItem = ({ plan, onEdit, onDelete }: InstallmentPlanItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const paidInstallments = plan.installments?.filter(i => i.status === 'linked').length || 0;
  const progress = (paidInstallments / plan.installment_count) * 100;

  return (
    <li data-ui="installment-plan-item" className="border rounded-lg transition-colors bg-card">
      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-t-lg">
        <div
          className="flex items-center gap-4 cursor-pointer flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{plan.name}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                {plan.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </span>
              <span>Start: {format(parseISO(plan.start_date), 'PP')}</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Progress: {paidInstallments}/{plan.installment_count}
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start pt-1">
          <Badge
            variant="outline"
            className={cn(
              'capitalize',
              plan.status === 'active'
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : plan.status === 'completed'
                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  : 'bg-red-500/10 text-red-500 border-red-500/20'
            )}
          >
            {plan.status}
          </Badge>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={e => {
              e.stopPropagation();
              onEdit(plan.id);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={e => {
              e.stopPropagation();
              onDelete(plan.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && plan.installments && (
        <div className="border-t p-4 bg-muted/10 rounded-b-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <p className="text-sm font-medium px-1 mb-2">Installment Breakdown</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {plan.installments.map(installment => (
                <div
                  onClick={() => {
                    (navigate as any)({
                      search: (prev: any) => ({
                        ...prev,
                        drawer: 'installment-link-payment',
                        installmentId: installment.id,
                        planId: plan.id,
                      }),
                    });
                  }}
                  key={installment.id}
                  className="p-2 border rounded-md bg-card text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold text-muted-foreground mr-2">
                      #{installment.installment_number}
                    </span>
                    <span>{format(parseISO(installment.due_date), 'MMM dd')}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] py-0 h-4 px-1.5',
                      installment.status === 'linked'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : installment.status === 'overdue'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    )}
                  >
                    {installment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
