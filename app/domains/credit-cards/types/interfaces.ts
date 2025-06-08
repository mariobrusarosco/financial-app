export interface ICreditCardStatement {
    total_due: string;
    due_date: string;
    period: string;
    min_payment: string;
    installment_options: ICreditCardInstallmentOption[];
    transactions: ICreditCardTransaction[];
    next_due_info?: ICreditCardNextDueInfo;
}


export interface ICreditCardTransaction {
    date: string;
    description: string;
    amount: string;
}

export interface ICreditCardInstallmentOption {
    months: number;
    total: string;
}

export interface ICreditCardNextDueInfo {
    next_due_amount: string;
    total_balance_due: string;
}
