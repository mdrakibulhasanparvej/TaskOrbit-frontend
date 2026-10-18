"use client";

import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ProjectMember,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "@/types";
import { priorityLabel } from "./TaskPriorityBadge";
import { statusLabel } from "./TaskStatusBadge";

export interface TaskFilterValues {
  search: string;
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  assigneeId: string | "ALL";
}

export const DEFAULT_TASK_FILTERS: TaskFilterValues = {
  search: "",
  status: "ALL",
  priority: "ALL",
  assigneeId: "ALL",
};

export default function TaskFilters({
  value,
  onChange,
  members,
  showAssignee = false,
}: {
  value: TaskFilterValues;
  onChange: (patch: Partial<TaskFilterValues>) => void;
  members?: ProjectMember[];
  showAssignee?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-56 flex-1">
        <IconSearch
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={value.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search tasks..."
          className="pl-8"
          autoComplete="off"
        />
      </div>

      <Select
        items={[
          { value: "ALL", label: "Any status" },
          ...TASK_STATUSES.map((status) => ({
            value: status,
            label: statusLabel(status),
          })),
        ]}
        value={value.status}
        onValueChange={(next) => {
          if (next === "ALL" || TASK_STATUSES.includes(next as TaskStatus)) {
            onChange({ status: next as TaskStatus | "ALL" });
          }
        }}
      >
        <SelectTrigger className="w-40" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Any status</SelectItem>
          {TASK_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {statusLabel(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={[
          { value: "ALL", label: "Any priority" },
          ...TASK_PRIORITIES.map((priority) => ({
            value: priority,
            label: priorityLabel(priority),
          })),
        ]}
        value={value.priority}
        onValueChange={(next) => {
          if (
            next === "ALL" ||
            TASK_PRIORITIES.includes(next as TaskPriority)
          ) {
            onChange({ priority: next as TaskPriority | "ALL" });
          }
        }}
      >
        <SelectTrigger className="w-40" aria-label="Filter by priority">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Any priority</SelectItem>
          {TASK_PRIORITIES.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priorityLabel(priority)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showAssignee && (
        <Select
          items={[
            { value: "ALL", label: "Anyone" },
            ...(members ?? []).map((member) => ({
              value: member.user.id,
              label: member.user.name,
            })),
          ]}
          value={value.assigneeId}
          onValueChange={(next) => {
            if (next) {
              onChange({ assigneeId: next });
            }
          }}
        >
          <SelectTrigger className="w-44" aria-label="Filter by assignee">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Anyone</SelectItem>
            {(members ?? []).map((member) => (
              <SelectItem key={member.id} value={member.user.id}>
                {member.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
