import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  login,
  logout,
  register,
  resendOtp,
  resetPassword,
  verifyEmail,
} from "@/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
