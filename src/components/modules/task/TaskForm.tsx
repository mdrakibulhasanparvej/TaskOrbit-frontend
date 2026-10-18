"use client";

import { useForm } from "@tanstack/react-form";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { FormField } from "@/components/shared/FormFields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask, useGetProjectMembers, useUpdateTask } from "@/hooks";
import { type CreateTaskValues, createTaskSchema } from "@/schemas";
import { TASK_PRIORITIES, type TaskDetail, type TaskPriority } from "@/types";
import triggerToast from "@/utils/triggerToast";
import { priorityLabel } from "./TaskPriorityBadge";

const UNASSIGNED = "none";

/** "bug, frontend" → `["bug", "frontend"]` (empties dropped while typing). */
function parseLabels(text: string) {
  return text
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

export default function TaskForm({
  projectId,
  task,
  open,
  onOpenChange,
}: {
  projectId: string;
  task?: TaskDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isEditing = Boolean(task);
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { data: membersData } = useGetProjectMembers(projectId);
  const members = membersData?.data ?? [];
  const isPending = isCreating || isUpdating;
  const [labelsText, setLabelsText] = useState(
    task ? task.labels.join(", ") : "",
  );

  const form = useForm({
    defaultValues: {
      projectId: task?.project_id ?? projectId,
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
      due_date: task?.due_date ? task.due_date.slice(0, 10) : "",
      labels: task?.labels ?? [],
      assigneeId: task?.assignee_id ?? null,
    } as CreateTaskValues,
    validators: {
      onSubmit: createTaskSchema,
    },
    onSubmit: ({ value }) => {
      if (isEditing && task) {
        // `status` and `projectId` are deliberately absent — status moves
        // go through PATCH /tasks/:id/status only (plan.md §9).
        updateTask(
          {
            taskId: task.id,
            projectId: task.project_id,
            payload: {
              title: value.title.trim(),
              description: value.description || null,
              priority: value.priority,
              due_date: value.due_date || null,
              labels: value.labels,
            },
          },
          {
            onSuccess: (response) => {
              if (!response.success) {
                triggerToast({
                  type: "error",
                  title: "Task update failed",
                  description: response.message || "Please try again.",
                });
                return;
              }

              triggerToast({
                type: "success",
                title: "Task updated",
                description: response.message || "The task was updated.",
              });
              onOpenChange(false);
            },
            onError: (error: FetchError) => {
              triggerToast({
                type: "error",
                title: "Task update failed",
                description: error.data?.message || "Internal Server Error",
              });
            },
          },
        );
        return;
      }

      createTask(
        {
          projectId,
          title: value.title.trim(),
          description: value.description || null,
          priority: value.priority,
          due_date: value.due_date || null,
          labels: value.labels,
          assigneeId: value.assigneeId ?? null,
        },
        {
          onSuccess: (response) => {
            if (!response.success) {
              triggerToast({
                type: "error",
                title: "Task creation failed",
                description: response.message || "Please try again.",
              });
              return;
            }

            triggerToast({
              type: "success",
              title: "Task created",
              description: response.message || "The task was created.",
            });
            setLabelsText("");
            form.reset();
            onOpenChange(false);
          },
          onError: (error: FetchError) => {
            triggerToast({
              type: "error",
              title: "Task creation failed",
              description: error.data?.message || "Internal Server Error",
            });
          },
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the task details below. Status changes live in the detail panel."
              : "Add a task to this project's TODO column."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FormField
                    id={field.name}
                    label="Title"
                    className="sm:col-span-2"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                    isInvalid={isInvalid}
                    errors={field.state.meta.errors}
                    disabled={isPending}
                    autoComplete="off"
                  />
                );
              }}
            </form.Field>

            <form.Field name="priority">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                  <Select
                    items={TASK_PRIORITIES.map((value) => ({
                      value,
                      label: priorityLabel(value),
                    }))}
                    value={field.state.value}
                    onValueChange={(value) => {
                      if (
                        value &&
                        TASK_PRIORITIES.includes(value as TaskPriority)
                      ) {
                        field.handleChange(value as TaskPriority);
                      }
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      disabled={isPending}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_PRIORITIES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {priorityLabel(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>

            <form.Field name="due_date">
              {(field) => (
                <FormField
                  id={field.name}
                  label="Due date"
                  type="date"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  isInvalid={false}
                  disabled={isPending}
                />
              )}
            </form.Field>

            {!isEditing && (
              <form.Field name="assigneeId">
                {(field) => (
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor={field.name}>Assignee</FieldLabel>
                    <Select
                      items={[
                        { value: UNASSIGNED, label: "Unassigned" },
                        ...members.map((member) => ({
                          value: member.user.id,
                          label: member.user.name,
                        })),
                      ]}
                      value={field.state.value ?? UNASSIGNED}
                      onValueChange={(value) => {
                        field.handleChange(
                          value && value !== UNASSIGNED ? value : null,
                        );
                      }}
                    >
                      <SelectTrigger
                        id={field.name}
                        className="w-full"
                        disabled={isPending}
                      >
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
                  </Field>
                )}
              </form.Field>
            )}

            <form.Field name="labels">
              {(field) => (
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Labels</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={labelsText}
                    onBlur={() => {
                      const parsed = parseLabels(labelsText);
                      field.handleChange(parsed);
                      setLabelsText(parsed.join(", "));
                    }}
                    onChange={(event) => {
                      const text = event.target.value;
                      setLabelsText(text);
                      field.handleChange(parseLabels(text));
                    }}
                    disabled={isPending}
                    placeholder="bug, frontend, urgent"
                    autoComplete="off"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                  <FieldDescription>
                    Comma separated — up to 10 labels, 30 characters each.
                  </FieldDescription>
                </Field>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    rows={4}
                    disabled={isPending}
                    placeholder="Describe the task (optional)"
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
