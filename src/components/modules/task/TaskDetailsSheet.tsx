"use client";

import {
  IconCalendarEvent,
  IconPencil,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { useState } from "react";
import AttachmentList from "@/components/modules/attachment/AttachmentList";
import CommentThread from "@/components/modules/comment/CommentThread";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAssignTask,
  useDeleteTask,
  useGetProfile,
  useGetProjectMembers,
  useGetTaskById,
  useMoveTask,
} from "@/hooks";
import { TASK_STATUSES, type TaskOrbitRole, type TaskStatus } from "@/types";
import getInitials from "@/utils/getInitials";
import triggerToast from "@/utils/triggerToast";
import TaskForm from "./TaskForm";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskStatusBadge, { statusLabel } from "./TaskStatusBadge";

const UNASSIGNED = "none";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(7rem,0.8fr)_1.2fr] gap-4 border-b py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 wrap-break-word text-sm font-medium">{value}</dd>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TaskDetailsSheet({
  projectId,
  taskId,
  open,
  onOpenChange,
}: {
  projectId: string;
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isLoading, isError, refetch } = useGetTaskById(
    open ? taskId : "",
  );
  const { data: profileData } = useGetProfile();
  // Phase-03 profile is typed with the legacy `Role` union; the runtime
  // value is always a TaskOrbit role (same assumption as RoleGuard, D5).
  const role = profileData?.data?.role as TaskOrbitRole | undefined;
  const { data: membersData } = useGetProjectMembers(projectId);
  const { mutate: moveTask, isPending: isMoving } = useMoveTask();
  const { mutate: assignTask, isPending: isAssigning } = useAssignTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const task = data?.data;
  const members = membersData?.data ?? [];
  const profile = profileData?.data;
  // Backend allows TEAM_MEMBER to PATCH /tasks/:id/status only as assignee;
  // ADMIN is blocked on that route (plan.md §9, risk #3).
  const isAssignee = task?.assignee_id === profile?.id;
  const canMove =
    role !== undefined &&
    role !== "ADMIN" &&
    (isAssignee || role === "PROJECT_MANAGER");
  const canAssign = role === "PROJECT_MANAGER";
  const canEdit = role === "PROJECT_MANAGER" || Boolean(isAssignee);
  const canDelete = role === "PROJECT_MANAGER" || role === "ADMIN";
  const isBusy = isMoving || isAssigning || isDeleting;

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setIsEditOpen(false);
          onOpenChange(nextOpen);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader className="border-b pr-12">
            <SheetTitle>Task details</SheetTitle>
            <SheetDescription>Full information for this task.</SheetDescription>
          </SheetHeader>

          {isLoading && (
            <div className="flex flex-col gap-3 px-4 py-6">
              <Skeleton className="h-8 w-2/3 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-48 rounded-lg" />
            </div>
          )}

          {isError && (
            <div className="px-4 py-10 text-center">
              <p className="font-medium">Couldn&apos;t load this task.</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => void refetch()}
              >
                Try again
              </Button>
            </div>
          )}

          {task && (
            <div className="flex flex-col gap-4 px-4 pb-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold wrap-break-word">
                  {task.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <TaskStatusBadge status={task.status} />
                  <TaskPriorityBadge priority={task.priority} />
                </div>
              </div>

              {canMove && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Move to</span>
                  <Select
                    items={TASK_STATUSES.map((value) => ({
                      value,
                      label: statusLabel(value),
                    }))}
                    value={task.status}
                    onValueChange={(value) => {
                      if (
                        value &&
                        TASK_STATUSES.includes(value as TaskStatus) &&
                        value !== task.status
                      ) {
                        moveTask(
                          {
                            taskId: task.id,
                            projectId: task.project_id,
                            status: value as TaskStatus,
                          },
                          {
                            onError: (error: FetchError) => {
                              triggerToast({
                                type: "error",
                                title: "Status change failed",
                                description:
                                  error.data?.message ||
                                  "Internal Server Error",
                              });
                            },
                          },
                        );
                      }
                    }}
                  >
                    <SelectTrigger className="w-full" disabled={isBusy}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {statusLabel(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {canAssign && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Assignee</span>
                  <Select
                    items={[
                      { value: UNASSIGNED, label: "Unassigned" },
                      ...members.map((member) => ({
                        value: member.user.id,
                        label: member.user.name,
                      })),
                    ]}
                    value={task.assignee_id ?? UNASSIGNED}
                    onValueChange={(value) => {
                      assignTask(
                        {
                          taskId: task.id,
                          projectId: task.project_id,
                          assigneeId:
                            value && value !== UNASSIGNED ? value : null,
                        },
                        {
                          onError: (error: FetchError) => {
                            triggerToast({
                              type: "error",
                              title: "Assign failed",
                              description:
                                error.data?.message || "Internal Server Error",
                            });
                          },
                        },
                      );
                    }}
                  >
                    <SelectTrigger className="w-full" disabled={isBusy}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.user.id}>
                          {member.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <dl className="rounded-lg border bg-muted/20 px-4">
                <Detail
                  label="Description"
                  value={task.description || "No description."}
                />
                <Detail
                  label="Labels"
                  value={task.labels.length > 0 ? task.labels.join(", ") : "—"}
                />
                <Detail label="Due date" value={formatDate(task.due_date)} />
                <Detail
                  label="Project"
                  value={`${task.project?.name ?? task.project_id}`}
                />
                <Detail
                  label="Created by"
                  value={task.created_by?.name ?? task.created_by_id}
                />
                <Detail label="Created" value={formatDate(task.created_at)} />
                <Detail label="Updated" value={formatDate(task.updated_at)} />
              </dl>

              {task.assignee ? (
                <div className="flex items-center gap-2 text-sm">
                  <IconUser aria-hidden="true" className="size-4" />
                  <span>Assigned to</span>
                  <Avatar className="size-6">
                    <AvatarImage src={task.assignee.avatar_url ?? ""} alt="" />
                    <AvatarFallback className="text-xs">
                      {getInitials(task.assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{task.assignee.name}</span>
                </div>
              ) : (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconUser aria-hidden="true" className="size-4" />
                  Unassigned
                </p>
              )}

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendarEvent aria-hidden="true" className="size-4" />
                {task._count.comments} comments
              </p>

              <Separator />

              <AttachmentList taskId={task.id} />

              <Separator />

              <CommentThread taskId={task.id} />

              {(canEdit || canDelete) && (
                <div className="flex justify-end gap-2">
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => setIsEditOpen(true)}
                    >
                      <IconPencil aria-hidden="true" />
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isBusy}
                      onClick={() =>
                        deleteTask(
                          {
                            taskId: task.id,
                            projectId: task.project_id,
                          },
                          {
                            onSuccess: (response) => {
                              if (!response.success) {
                                triggerToast({
                                  type: "error",
                                  title: "Task deletion failed",
                                  description:
                                    response.message || "Please try again.",
                                });
                                return;
                              }

                              triggerToast({
                                type: "success",
                                title: "Task deleted",
                                description:
                                  response.message || "The task was deleted.",
                              });
                              onOpenChange(false);
                            },
                            onError: (error: FetchError) => {
                              triggerToast({
                                type: "error",
                                title: "Task deletion failed",
                                description:
                                  error.data?.message ||
                                  "Internal Server Error",
                              });
                            },
                          },
                        )
                      }
                    >
                      {isDeleting && "Deleting..."}
                      {!isDeleting && (
                        <>
                          <IconTrash aria-hidden="true" />
                          Delete
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {task && (
        <TaskForm
          projectId={task.project_id}
          task={task}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </>
  );
}
