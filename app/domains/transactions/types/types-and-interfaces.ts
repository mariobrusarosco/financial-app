export interface I_Transaction {
  id: string;
  account_id: string;
  broker_id: string;
  is_deleted: boolean;
  is_paid: boolean;
  date: string;
  amount: string;
  description: string;
}
