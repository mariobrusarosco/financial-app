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
