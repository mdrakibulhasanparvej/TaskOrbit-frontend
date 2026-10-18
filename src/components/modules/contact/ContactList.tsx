"use client";

import { IconMail, IconRefresh } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { useMemo, useState } from "react";
import MyPagination from "@/components/shared/Pagination";
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
import { useGetContactMessages, useUpdateContactMessageStatus } from "@/hooks";
import type { ContactMessage, ContactStatus, Query } from "@/types";
import { CONTACT_STATUSES } from "@/types";
import triggerToast from "@/utils/triggerToast";
import ContactStatusBadge from "./ContactStatusBadge";

const PAGE_LIMIT = 10;
const ALL = "ALL";

const statusLabel = (value: ContactStatus) =>
  value.charAt(0) + value.slice(1).toLowerCase();

/**
 * Admin contact inbox (plan.md §9 — GET /contact?status= + PATCH
 * /contact/:id). Opening a NEW message marks it READ; RESOLVED can be set
 * from the row menu. Paginated + status-filtered.
 */
export default function ContactList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ContactStatus | undefined>(undefined);

  const { mutate: updateStatus, isPending } = useUpdateContactMessageStatus();

  const query = useMemo<Query>(
    () => ({ page, limit: PAGE_LIMIT, status }),
    [page, status],
  );
  const { data, isLoading, isError, refetch } = useGetContactMessages(query);
  const messages = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleStatusChange = (message: ContactMessage, next: ContactStatus) => {
    if (isPending || next === message.status) return;

    updateStatus(
      { messageId: message.id, payload: { status: next } },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Update failed",
              description: response.message || "Please try again.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Status updated",
            description: `Marked as ${statusLabel(next).toLowerCase()}.`,
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Update failed",
            description: error.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Messages submitted through the public contact form.
        </p>

        <Select
          value={status ?? ALL}
          onValueChange={(value) => {
            setStatus(value === ALL ? undefined : (value as ContactStatus));
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
            {CONTACT_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {statusLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from(
            { length: 5 },
            (_, index) => `contact-skeleton-${index}`,
          ).map((key) => (
            <div key={key} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <p className="font-medium">Couldn&apos;t load messages.</p>
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
      ) : messages.length === 0 ? (
        <div className="rounded-xl border bg-card px-6 py-12 text-center">
          <IconMail
            aria-hidden
            className="mx-auto size-8 text-muted-foreground"
          />
          <p className="mt-3 font-medium">No messages found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {status
              ? "Try a different status filter."
              : "The inbox is empty — new submissions will appear here."}
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="min-w-64">Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{message.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {message.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48 truncate">
                    {message.subject}
                  </TableCell>
                  <TableCell className="max-w-72">
                    <p className="line-clamp-2 whitespace-normal text-sm text-muted-foreground">
                      {message.message}
                    </p>
                  </TableCell>
                  <TableCell>
                    <ContactStatusBadge status={message.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      {message.status === "NEW" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleStatusChange(message, "READ")}
                        >
                          Mark read
                        </Button>
                      )}
                      {message.status !== "RESOLVED" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            handleStatusChange(message, "RESOLVED")
                          }
                        >
                          Resolve
                        </Button>
                      )}
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
    </div>
  );
}
