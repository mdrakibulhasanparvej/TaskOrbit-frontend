import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminProject,
  getAdminPayments,
  getAdminProjects,
  getAdminReports,
  getAdminSettings,
  getAdminUsers,
  updateAdminSettings,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "@/api";
import type {
  AdminUpdateSettingsPayload,
  AdminUpdateUserRolePayload,
  AdminUpdateUserStatusPayload,
  Query,
} from "@/types";

// Query keys (Phase 08): ["admin","users"|"projects"|"payments"|"reports"],
// ["admin","settings"]. Distinct from the Phase 04 ["analytics","admin"] key.

export const useGetAdminUsers = (query: Query = {}) => {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => getAdminUsers(query),
  });
};

export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: AdminUpdateUserStatusPayload;
    }) => updateAdminUserStatus(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useUpdateAdminUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: AdminUpdateUserRolePayload;
    }) => updateAdminUserRole(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useGetAdminProjects = (query: Query = {}) => {
  return useQuery({
    queryKey: ["admin", "projects", query],
    queryFn: () => getAdminProjects(query),
  });
};

export const useDeleteAdminProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => deleteAdminProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useGetAdminPayments = (query: Query = {}) => {
  return useQuery({
    queryKey: ["admin", "payments", query],
    queryFn: () => getAdminPayments(query),
  });
};

export const useGetAdminReports = (query: Query = {}) => {
  return useQuery({
    queryKey: ["admin", "reports", query],
    queryFn: () => getAdminReports(query),
  });
};

export const useGetAdminSettings = () => {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: getAdminSettings,
  });
};

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminUpdateSettingsPayload) =>
      updateAdminSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
};
