export interface I_TransactionCategory {
  id: string;
  name: string;
  icon?: string;
  type: 'expense' | 'income' | 'investment' | 'transfer';
}

// Mock category data organized by transaction type
export const MOCK_CATEGORIES: Record<string, I_TransactionCategory[]> = {
  expense: [
    { id: 'food', name: 'Food & Dining', icon: '🍽️', type: 'expense' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', type: 'expense' },
    { id: 'gas', name: 'Gas & Fuel', icon: '⛽', type: 'expense' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', type: 'expense' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', type: 'expense' },
    { id: 'bills', name: 'Bills & Utilities', icon: '🏠', type: 'expense' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', type: 'expense' },
    { id: 'transport', name: 'Transportation', icon: '🚗', type: 'expense' },
    { id: 'education', name: 'Education', icon: '📚', type: 'expense' },
    { id: 'travel', name: 'Travel', icon: '✈️', type: 'expense' },
    { id: 'investment_loss', name: 'Investment Loss', icon: '📉', type: 'expense' },
  ],
  income: [
    { id: 'salary', name: 'Salary', icon: '💼', type: 'income' },
    { id: 'freelance', name: 'Freelance', icon: '💻', type: 'income' },
    { id: 'bonus', name: 'Bonus', icon: '🎉', type: 'income' },
    { id: 'investment-return', name: 'Investment Returns', icon: '📈', type: 'income' },
    { id: 'rental', name: 'Rental Income', icon: '🏡', type: 'income' },
    { id: 'gift', name: 'Gift/Refund', icon: '🎁', type: 'income' },
  ],
  investment: [
    { id: 'stocks', name: 'Stocks', icon: '📊', type: 'investment' },
    { id: 'bonds', name: 'Bonds', icon: '📜', type: 'investment' },
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿', type: 'investment' },
    { id: 'mutual-funds', name: 'Mutual Funds', icon: '📈', type: 'investment' },
    { id: 'etf', name: 'ETF', icon: '📊', type: 'investment' },
    { id: 'real-estate', name: 'Real Estate', icon: '🏘️', type: 'investment' },
  ],
  transfer: [
    { id: 'account-transfer', name: 'Account Transfer', icon: '↔️', type: 'transfer' },
    { id: 'loan-payment', name: 'Loan Payment', icon: '🏦', type: 'transfer' },
    { id: 'savings', name: 'Savings', icon: '💰', type: 'transfer' },
    { id: 'credit-payment', name: 'Credit Card Payment', icon: '💳', type: 'transfer' },
  ],
};

// Get categories for a specific transaction type
export const getCategoriesForType = (type: string): I_TransactionCategory[] => {
  return MOCK_CATEGORIES[type] || [];
};

// Get all categories
export const getAllCategories = (): I_TransactionCategory[] => {
  return Object.values(MOCK_CATEGORIES).flat();
};

// Find category by ID
export const findCategoryById = (id: string): I_TransactionCategory | undefined => {
  return getAllCategories().find(category => category.id === id);
};
