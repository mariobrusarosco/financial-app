import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/$creditCardId/')({
  component: () => {
    const params = Route.useParams();

    return (
      <Navigate
        to="/accounts/$slug/credit-card/$creditCardId/transactions"
        params={{ slug: params.slug, creditCardId: params.creditCardId }}
        replace
      />
    );
  },
});
