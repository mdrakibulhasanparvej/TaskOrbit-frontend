"use client";

import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteProject } from "@/hooks";
import triggerToast from "@/utils/triggerToast";

/**
 * Destructive confirmation for `DELETE /projects/:id` (guard: PROJECT_MANAGER
 * owner / ADMIN). On success the project is removed and the owner is sent back
 * to their project list.
 */
export default function DeleteProjectDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
}: {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { mutate: deleteProject, isPending } = useDeleteProject();

  const handleDelete = () => {
    if (isPending) return;

    deleteProject(projectId, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Delete failed",
            description: response.message || "Please try again.",
          });
          return;
        }

        triggerToast({
          type: "success",
          title: "Project deleted",
          description: `${projectName} has been removed.`,
        });
        onOpenChange(false);
        router.push("/project-manager/projects");
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Delete failed",
          description: error.data?.message || "Internal Server Error",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">{projectName}</span>{" "}
            along with its tasks, members and invitations. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending && <Spinner />}
            {isPending ? "Deleting..." : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
