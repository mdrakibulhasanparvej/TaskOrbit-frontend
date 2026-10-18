import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  changePassword,
  getProfile,
  updatedProfilePicture,
  updateUserProfile,
} from "@/api";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });
};

export const useGetProfileSuspense = () => {
  return useSuspenseQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatedProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

/** PATCH /users/me/password (plan.md §5 U4) — added in Phase 03; existing hooks untouched. */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
