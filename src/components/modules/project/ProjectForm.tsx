"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { FormField } from "@/components/shared/FormFields";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject, useUpdateProject } from "@/hooks";
import { createProjectSchema } from "@/schemas";
import type {
  CreateProjectPayload,
  ProjectDetail,
  ProjectStatus,
} from "@/types";
import { PROJECT_STATUSES } from "@/types";
import triggerToast from "@/utils/triggerToast";

function statusLabel(status: ProjectStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ");
}

export default function ProjectForm({ project }: { project?: ProjectDetail }) {
  const router = useRouter();
  const isEditing = Boolean(project);
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const isPending = isCreating || isUpdating;

  const form = useForm({
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      start_date: project?.start_date ? project.start_date.slice(0, 10) : "",
      end_date: project?.end_date ? project.end_date.slice(0, 10) : "",
      status: project?.status ?? "PLANNING",
    } as CreateProjectPayload,
    validators: {
      onSubmit: createProjectSchema,
    },
    onSubmit: ({ value }) => {
      const payload: CreateProjectPayload = {
        name: value.name,
        description: value.description || null,
        start_date: value.start_date,
        end_date: value.end_date || null,
        status: value.status,
      };

      if (isEditing && project) {
        updateProject(
          { projectId: project.id, payload },
          {
            onSuccess: (response) => {
              if (!response.success) {
                triggerToast({
                  type: "error",
                  title: "Project update failed",
                  description: response.message || "Please try again.",
                });
                return;
              }

              triggerToast({
                type: "success",
                title: "Project updated",
                description: response.message || "The project was updated.",
              });
              router.push(`/project-manager/projects/${project.id}`);
            },
            onError: (error: FetchError) => {
              triggerToast({
                type: "error",
                title: "Project update failed",
                description: error.data?.message || "Internal Server Error",
              });
            },
          },
        );
        return;
      }

      createProject(payload, {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Project creation failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Project created",
            description: response.message || "The project was created.",
          });
          router.push(
            response.data?.id
              ? `/project-manager/projects/${response.data.id}`
              : "/project-manager/projects",
          );
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Project creation failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      });
    },
  });

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          {isEditing ? "Edit project" : "Create project"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEditing
            ? "Update the project details below."
            : "Set up a new project and invite your team."}
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6 rounded-lg border bg-card p-5 sm:p-6"
      >
        <FieldGroup className="grid gap-5 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FormField
                  id={field.name}
                  label="Project name"
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

          <form.Field name="status">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                <Select
                  items={PROJECT_STATUSES.map((value) => ({
                    value,
                    label: statusLabel(value),
                  }))}
                  value={field.state.value}
                  onValueChange={(value) => {
                    if (
                      value &&
                      PROJECT_STATUSES.includes(value as ProjectStatus)
                    ) {
                      field.handleChange(value as ProjectStatus);
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
                    {PROJECT_STATUSES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {statusLabel(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          <form.Field name="start_date">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FormField
                  id={field.name}
                  label="Start date"
                  type="date"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  isInvalid={isInvalid}
                  errors={field.state.meta.errors}
                  disabled={isPending}
                />
              );
            }}
          </form.Field>

          <form.Field name="end_date">
            {(field) => (
              <FormField
                id={field.name}
                label="End date"
                type="date"
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                isInvalid={false}
                disabled={isPending}
              />
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
                  placeholder="Describe the project (optional)"
                />
                <FieldDescription>
                  Leave blank if you don&apos;t have a description yet.
                </FieldDescription>
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => router.push("/project-manager/projects")}
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
                : "Create project"}
          </Button>
        </div>
      </form>
    </section>
  );
}
