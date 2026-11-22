import { useCreateCreditCard } from '@/domains/credit-cards/hooks/use-create-credit-card';
import {
  CreditCardForm,
  type CreditCardFormValues,
} from '@/domains/credit-cards/components/credit-card-form';

interface Props {
  accountId?: string;
}

export const CreateCreditCardForm = ({ accountId }: Props) => {
  const initialValues: CreditCardFormValues = {
    account_id: accountId ?? '',
    name: '',
    last_four_digits: '',
    brand: 'visa',
    credit_limit: 0,
    due_day: 1,
    is_active: true,
  };

  const { createCreditCard, error } = useCreateCreditCard({
    accountId: accountId ?? '',
  });

  return (
    <CreditCardForm
      formId="credit-card-create-form"
      initialValues={initialValues}
      showAccountField
      error={error}
      onSubmit={value => {
        void createCreditCard({
          name: value.name,
          last_four_digits: value.last_four_digits,
          brand: value.brand,
          credit_limit: value.credit_limit,
          due_day: value.due_day,
        });
      }}
    />
  );
};
