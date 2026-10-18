import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStripeCheckout,
  getMySubscription,
  getPaymentHistory,
  getPlans,
  verifyPayment,
} from "@/api";

export const useCreateStripeCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStripeCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};

export const useGetPaymentHistory = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getPaymentHistory,
  });
};

export const useGetPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });
};

export const useGetMySubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: getMySubscription,
  });
};

export const useVerifyPayment = (sessionId: string) => {
  return useQuery({
    queryKey: ["payments", "verify", sessionId],
    queryFn: () => verifyPayment(sessionId),
    enabled: Boolean(sessionId),
  });
};
