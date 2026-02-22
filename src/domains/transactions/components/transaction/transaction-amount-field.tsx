
import { useState } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { Calculator } from '@/domains/ui-system/components/calculator';

interface TransactionAmountFieldProps {
    field: any; // We'll keep it loose for now to avoid complex type gymnastics with TanStack Form
    isEditMode: boolean;
}

export const TransactionAmountField = ({ field, isEditMode }: TransactionAmountFieldProps) => {
    const [showCalculator, setShowCalculator] = useState(false);

    return (
        <div className="space-y-2 relative">
            <Label htmlFor={field.name}>Amount</Label>
            <Input
                id={field.name}
                type="number"
                step="0.01"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={isEditMode ? 'text-sm' : ''}
            />
            <div className="flex items-center gap-2 absolute right-0 top-0">
                <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs text-muted-foreground"
                    onClick={() => setShowCalculator(!showCalculator)}
                    type="button"
                >
                    <CalculatorIcon className="w-3 h-3 mr-1" />
                    {showCalculator ? 'Hide' : 'Calc'}
                </Button>
            </div>
            {showCalculator && (
                <div className="absolute z-50 -mt-10 shadow-lg bg-white rounded-md border text-left">
                    <Calculator
                        initialValue={field.state.value ? Number(field.state.value) : undefined}
                        onApply={(val) => {
                            field.handleChange(val.toString());
                            setShowCalculator(false);
                        }}
                        onClose={() => setShowCalculator(false)}
                        className="w-[280px]"
                    />
                </div>
            )}
            {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                    {field.state.meta.errors.map((error: any) => (
                        typeof error === 'string' ? error : (error?.message || JSON.stringify(error))
                    )).join(', ')}
                </p>
            )}
        </div>
    );
};
