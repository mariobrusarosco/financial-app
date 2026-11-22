import { useNavigate } from '@tanstack/react-router';
import { CreditCard, Loader2 } from 'lucide-react';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import { Route } from '@/routes/(auth)/route';
import { useCreditCard } from '@/domains/credit-cards/hooks/use-credit-card';
import { useUpdateCreditCard } from '@/domains/credit-cards/hooks/use-update-credit-card';
import { CreditCardForm } from '@/domains/credit-cards/components/credit-card-form';

const FORM_ID = 'credit-card-edit-form';

export const EditCreditCardDrawer = () => {
  const navigate = useNavigate();
  const { creditCardId } = Route.useSearch();
  const { data: creditCard, isLoading, isError } = useCreditCard(creditCardId ?? '');
  const updateCreditCard = useUpdateCreditCard();

  const closeDrawer = () => {
    void navigate({
      search: ((prev: Record<string, unknown>) => ({
        ...prev,
        drawer: undefined,
        creditCardId: undefined,
      })) as never,
    });
  };

  if (isLoading) {
    return (
      <DrawerLayout data-ui="edit-credit-card-drawer">
        <DrawerLayoutHeader icon={CreditCard} title="Edit credit card" />
        <DrawerLayoutBody className="grid place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  if (isError || !creditCard) {
    return (
      <DrawerLayout data-ui="edit-credit-card-drawer">
        <DrawerLayoutHeader icon={CreditCard} title="Edit credit card" />
        <DrawerLayoutBody>
          <p className="text-sm text-destructive">We couldn&apos;t load this credit card.</p>
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  const isSaving = updateCreditCard.isPending;

  return (
    <DrawerLayout data-ui="edit-credit-card-drawer">
      <DrawerLayoutHeader
        icon={CreditCard}
        title="Edit credit card"
        description={creditCard.name}
      />
      <DrawerLayoutBody>
        <CreditCardForm
          key={creditCard.id}
          formId={FORM_ID}
          showActiveField
          initialValues={{
            account_id: creditCard.account_id,
            name: creditCard.name,
            last_four_digits: creditCard.last_four_digits,
            brand: creditCard.brand,
            credit_limit: creditCard.credit_limit,
            due_day: creditCard.due_day ?? 0,
            is_active: creditCard.is_active,
          }}
          onSubmit={value =>
            updateCreditCard.mutate(
              {
                creditCardId: creditCard.id,
                payload: {
                  name: value.name,
                  brand: value.brand,
                  last_four_digits: value.last_four_digits,
                  credit_limit: value.credit_limit,
                  due_day: value.due_day,
                  is_active: value.is_active,
                },
              },
              { onSuccess: closeDrawer }
            )
          }
        />
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        <DrawerLayoutCancel />
        <Button type="submit" form={FORM_ID} disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
