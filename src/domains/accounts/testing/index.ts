import { http, HttpResponse, delay } from 'msw';
import { ACCOUNTS_ROUTES } from '../api/backend-routes';
import { I_Account, I_BalancePoint } from '../types/types-and-interfaces';

/**
 * Creates MSW handlers for Account Active List
 */
export const mockActiveAccounts = (
  response: I_Account[] | HttpResponse = [],
  options: { delay?: boolean | number } = {}
) => {
  return http.get(`*${ACCOUNTS_ROUTES.LIST_ACTIVE}`, async () => {
    if (options.delay) {
      await delay(typeof options.delay === 'number' ? options.delay : 'infinite');
    }

    if (response instanceof Response) {
      return response;
    }

    return HttpResponse.json(response);
  });
};

/**
 * Creates MSW handlers for Account Balance Points
 */
export const mockAccountBalancePoints = (
  accountId: string,
  response: I_BalancePoint[] | HttpResponse = [],
  options: { delay?: boolean | number } = {}
) => {
  return http.get(`*${ACCOUNTS_ROUTES.BALANCE_POINTS(accountId)}`, async () => {
    if (options.delay) {
      await delay(typeof options.delay === 'number' ? options.delay : 'infinite');
    }

    if (response instanceof Response) {
      return response;
    }

    return HttpResponse.json(response);
  });
};

/**
 * Creates MSW handlers for Account Creation
 */
export const mockCreateAccount = (
  response: I_Account | HttpResponse | undefined = undefined,
  options: { delay?: boolean | number } = {}
) => {
  return http.post(`*${ACCOUNTS_ROUTES.LIST}`, async ({ request }) => {
    if (options.delay) {
      await delay(typeof options.delay === 'number' ? options.delay : 'infinite');
    }

    if (response instanceof Response) {
      return response;
    }

    // Default behavior: echo back the body with a new ID
    if (!response) {
      const body = (await request.json()) as any;
      return HttpResponse.json({ ...body, id: 'new-acc-id' }, { status: 201 });
    }

    return HttpResponse.json(response, { status: 201 });
  });
};
