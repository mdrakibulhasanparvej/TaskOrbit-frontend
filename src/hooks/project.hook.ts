import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvitation,
  createProject,
  declineInvitation,
  deleteProject,
  getMyInvitations,
  getProjectById,
  getProjectInvitations,
  getProjectMembers,
  getProjects,
  inviteMember,
  removeProjectMember,
  updateProject,
} from "@/api";
import type { ProjectsQuery, UpdateProjectPayload } from "@/types";

export const useGetProjects = (query: ProjectsQuery) => {
  return useQuery({
    queryKey: ["projects", query],
    queryFn: () => getProjects(query),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: Boolean(projectId),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: UpdateProjectPayload;
    }) => updateProject(projectId, payload),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useGetProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
    }: {
      projectId: string;
      memberId: string;
    }) => removeProjectMember(projectId, memberId),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, email }: { projectId: string; email: string }) =>
      inviteMember(projectId, email),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["project-invitations", projectId],
      });
    },
  });
};

export const useGetProjectInvitations = (projectId: string) => {
  return useQuery({
    queryKey: ["project-invitations", projectId],
    queryFn: () => getProjectInvitations(projectId),
    enabled: Boolean(projectId),
  });
};

export const useGetMyInvitations = () => {
  return useQuery({
    queryKey: ["invitations", "mine"],
    queryFn: getMyInvitations,
    // Keep the sidebar "Invitations" badge fresh, mirroring the notification
    // unread counter (no SSE/websocket on the backend).
    refetchInterval: 60_000,
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeclineInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: declineInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
