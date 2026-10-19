"use client";

import { IconRefresh, IconSearch, IconUserCog } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { useEffect, useMemo, useState } from "react";
import MyPagination from "@/components/shared/Pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAdminUsers, useUpdateAdminUserStatus } from "@/hooks";
import type { AdminUser, AdminUserStatus, Query, TaskOrbitRole } from "@/types";
import triggerToast from "@/utils/triggerToast";
import ChangeRoleDialog from "./ChangeRoleDialog";
import UserStatusBadge from "./UserStatusBadge";

const PAGE_LIMIT = 10;
const ALL = "ALL";

const ROLE_LABELS: Record<TaskOrbitRole, string> = {
  ADMIN: "Admin",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member",
  CLIENT: "Client",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Admin user directory (plan.md §9 — GET /admin/users) with suspend/restore
 * (PATCH status) and role change (PATCH role via dialog). The backend
 * protects the primary admin and blocks self-changes; those 4xxs surface as
 * toasts.
 */
export default function UserTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<TaskOrbitRole | undefined>(undefined);
  const [status, setStatus] = useState<AdminUserStatus | undefined>(undefined);
  const [roleDialogUser, setRoleDialogUser] = useState<AdminUser | null>(null);

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAdminUserStatus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<Query>(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search: search || undefined,
      role,
      user_status: status,
    }),
    [page, search, role, status],
  );

  const { data, isLoading, isError, refetch } = useGetAdminUsers(query);
  const users = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleToggleStatus = (user: AdminUser) => {
    if (isUpdating) return;

    const nextStatus: AdminUserStatus =
      user.user_status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    updateStatus(
      { userId: user.id, payload: { user_status: nextStatus } },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Status update failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Status updated",
            description: `${user.name} is now ${nextStatus.toLowerCase()}.`,
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Status update failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <IconSearch
            aria-hidden
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or email..."
            aria-label="Search users"
            className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <Select
          value={role ?? ALL}
          onValueChange={(value) => {
            setRole(value === ALL ? undefined : (value as TaskOrbitRole));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by role">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All roles</SelectItem>
            {(Object.keys(ROLE_LABELS) as TaskOrbitRole[]).map((value) => (
              <SelectItem key={value} value={value}>
                {ROLE_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status ?? ALL}
          onValueChange={(value) => {
            setStatus(value === ALL ? undefined : (value as AdminUserStatus));
            setPage(1);
          }}
        >
          <SelectTrigger
            className="w-full sm:w-44"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from(
            { length: 5 },
            (_, index) => `user-skeleton-${index}`,
          ).map((key) => (
            <div key={key} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">Couldn&apos;t load users.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            <IconRefresh aria-hidden />
            Try again
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">No users found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Projects</TableHead>
                <TableHead className="text-right">Tasks</TableHead>
                <TableHead>Last login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        {user.avatar_url && (
                          <AvatarImage src={user.avatar_url} alt={user.name} />
                        )}
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{ROLE_LABELS[user.role]}</TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.user_status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {user._count.owned_projects}
                  </TableCell>
                  <TableCell className="text-right">
                    {user._count.assigned_tasks}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleDialogUser(user)}
                      >
                        <IconUserCog aria-hidden />
                        Role
                      </Button>
                      <Button
                        type="button"
                        variant={
                          user.user_status === "ACTIVE"
                            ? "destructive"
                            : "outline"
                        }
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.user_status === "ACTIVE" ? "Suspend" : "Restore"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <MyPagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      {roleDialogUser && (
        <ChangeRoleDialog
          user={roleDialogUser}
          open={Boolean(roleDialogUser)}
          onOpenChange={(open) => {
            if (!open) setRoleDialogUser(null);
          }}
        />
      )}
    </div>
  );
}
