import { useQuery } from "@tanstack/react-query";
import {
  getAdminAnalytics,
  getManagerAnalytics,
  getMemberAnalytics,
  getProjectAnalytics,
} from "@/api";

export const useGetAdminAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "admin"],
    queryFn: getAdminAnalytics,
  });
};

export const useGetManagerAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "manager"],
    queryFn: getManagerAnalytics,
  });
};

export const useGetMemberAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "member"],
    queryFn: getMemberAnalytics,
  });
};

export const useGetProjectAnalytics = (projectId: string) => {
  return useQuery({
    queryKey: ["analytics", "project", projectId],
    queryFn: () => getProjectAnalytics(projectId),
    enabled: Boolean(projectId),
  });
};
