import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentsApi } from '../api/investments.api';
import type {
  I_CreateInvestmentRequest,
  I_CreateInvestmentMovementRequest,
  I_CreateInvestmentBalanceRequest,
} from '../types/types-and-interfaces';

// Query key factories
export const getInvestmentsQueryKey = () => ['investments'];
export const getInvestmentQueryKey = (investmentId: string) => ['investment', investmentId];
export const getInvestmentMovementsQueryKey = (investmentId: string) => [
  'investment-movements',
  investmentId,
];

// Get all investments
export const useInvestments = () => {
  return useQuery({
    queryKey: getInvestmentsQueryKey(),
    queryFn: () => investmentsApi.getAllInvestments(),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
