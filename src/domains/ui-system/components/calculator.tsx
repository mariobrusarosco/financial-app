import React, { useState } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Delete, Check } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils/index';

interface CalculatorProps {
    onApply: (value: number) => void;
    onClose?: () => void;
    initialValue?: number;
    className?: string;
}

export const Calculator = ({ onApply, onClose, initialValue, className }: CalculatorProps) => {
    const [expression, setExpression] = useState(initialValue ? initialValue.toString() : '');
    const [result, setResult] = useState<number | null>(initialValue || null);

    const handlePress = (char: string) => {
        setExpression((prev) => prev + char);
    };

    const handleClear = () => {
        setExpression('');
        setResult(null);
    };

    const handleBackspace = () => {
        setExpression((prev) => prev.slice(0, -1));
    };

    const handleCalculate = () => {
        try {
            // Basic sanitization: only allow digits, operators, and decimal points
            const sanitized = expression.replace(/[^0-9+\-*/.]/g, '');
            if (!sanitized) return;

            // eslint-disable-next-line no-new-func
            const calcResult = new Function(`return ${sanitized}`)();
            setResult(calcResult);
            setExpression(String(calcResult));
        } catch (error) {
            setExpression('Error');
        }
    };

    const handleApply = () => {
        if (result !== null) {
            onApply(result);
        } else if (expression) {
            // Try to calculate if the user hits apply without hitting equals
            try {
                const sanitized = expression.replace(/[^0-9+\-*/.]/g, '');
                // eslint-disable-next-line no-new-func
                const calcResult = new Function(`return ${sanitized}`)();
                onApply(calcResult);
            } catch {
                // ignore
            }
        }
        if (onClose) onClose();
    };

    return (
        <div className={cn("p-4 border rounded-md bg-card shadow-sm w-full max-w-[320px]", className)}>
            <div className="flex gap-2 mb-2">
                <Input
                    value={expression}
                    readOnly
                    className="text-right font-mono"
                    placeholder="0"
                />
                <Button variant="outline" size="icon" onClick={handleBackspace} type="button">
                    <Delete className="size-4" />
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/'].map((char) => (
                    <Button
                        key={char}
                        variant={['/'].includes(char) ? 'secondary' : 'outline'}
                        onClick={() => handlePress(char)}
                        type="button"
                    >
                        {char}
                    </Button>
                ))}
                {['4', '5', '6', '*'].map((char) => (
                    <Button
                        key={char}
                        variant={['*'].includes(char) ? 'secondary' : 'outline'}
                        onClick={() => handlePress(char)}
                        type="button"
                    >
                        {char}
                    </Button>
                ))}
                {['1', '2', '3', '-'].map((char) => (
                    <Button
                        key={char}
                        variant={['-'].includes(char) ? 'secondary' : 'outline'}
                        onClick={() => handlePress(char)}
                        type="button"
                    >
                        {char}
                    </Button>
                ))}
                {['0', '.', '=', '+'].map((char) => (
                    <Button
                        key={char}
                        variant={char === '=' ? 'default' : (['+'].includes(char) ? 'secondary' : 'outline')}
                        onClick={char === '=' ? handleCalculate : () => handlePress(char)}
                        type="button"
                    >
                        {char}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outline" onClick={handleClear} type="button">
                    Clear
                </Button>
                <Button variant="default" onClick={handleApply} type="button" disabled={!expression && result === null}>
                    <Check className="mr-2 size-4" /> Apply
                </Button>
            </div>
        </div>
    );
};
