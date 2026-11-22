import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentsApi } from '../api/investments.api';
import type {
  I_CreateInvestmentRequest,
  I_CreateInvestmentMovementRequest,
  I_CreateInvestmentBalanceRequest,
  I_InvestmentsParams,
} from '../types/types-and-interfaces';

// Query key factories
export const getInvestmentsQueryKey = () => ['investments'];
export const getInvestmentQueryKey = (investmentId: string) => ['investment', investmentId];
export const getInvestmentMovementsQueryKey = (investmentId: string) => [
  'investment-movements',
  investmentId,
];

// Get all investments; with a date range, the figures cover only that range
export const useInvestments = (
  params?: I_InvestmentsParams,
  { enabled = true }: { enabled?: boolean } = {}
) => {
  return useQuery({
    // The range goes after the base key, so invalidating getInvestmentsQueryKey() refreshes every range
    queryKey: [...getInvestmentsQueryKey(), params],
    queryFn: () => investmentsApi.getAllInvestments(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });
};

// Get specific investment
export const useInvestment = (investmentId: string | undefined) => {
  return useQuery({
    queryKey: getInvestmentQueryKey(investmentId || ''),
    queryFn: () => investmentsApi.getInvestment(investmentId!),
    enabled: !!investmentId,
    staleTime: 1000 * 60 * 5,
  });
};

// Get investment movements
export const useInvestmentMovements = (investmentId: string | undefined) => {
  return useQuery({
    queryKey: getInvestmentMovementsQueryKey(investmentId || ''),
    queryFn: () => investmentsApi.getInvestmentMovements(investmentId!),
    enabled: !!investmentId,
    staleTime: 1000 * 60 * 2,
  });
};

// Create investment
export const useCreateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (investment: I_CreateInvestmentRequest) =>
      investmentsApi.createInvestment(investment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getInvestmentsQueryKey() });
    },
  });
};

// Create investment movement
export const useCreateInvestmentMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movement: I_CreateInvestmentMovementRequest) =>
      investmentsApi.createMovement(movement),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getInvestmentMovementsQueryKey(variables.investment_id),
      });
      queryClient.invalidateQueries({
        queryKey: getInvestmentQueryKey(variables.investment_id),
      });
      queryClient.invalidateQueries({ queryKey: getInvestmentsQueryKey() });
    },
  });
};

// Create investment balance
export const useCreateInvestmentBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (balance: I_CreateInvestmentBalanceRequest) =>
      investmentsApi.createBalance(balance),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getInvestmentQueryKey(variables.investment_id),
      });
      queryClient.invalidateQueries({ queryKey: getInvestmentsQueryKey() });
      queryClient.invalidateQueries({ queryKey: ['investment-balance-history'] });
    },
  });
};

// Delete investment
export const useDeleteInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (investmentId: string) => investmentsApi.deleteInvestment(investmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getInvestmentsQueryKey() });
    },
  });
};
