"use client";

import type { CommentReply, TaskOrbitRole } from "@/types";
import CommentItem from "./CommentItem";

/**
 * One-level reply list for a top-level comment. Every reply renders through
 * the same `CommentItem` (with `isReply`), so replies never offer a nested
 * "Reply" action — the backend 400s on replies to replies.
 */
export default function CommentReplies({
  replies,
  taskId,
  currentUserId,
  role,
}: {
  replies: CommentReply[];
  taskId: string;
  currentUserId: string | undefined;
  role: TaskOrbitRole | undefined;
}) {
  return (
    <ul className="mt-2 flex flex-col gap-3 border-l pl-3">
      {replies.map((reply) => (
        <li key={reply.id}>
          <CommentItem
            comment={reply}
            taskId={taskId}
            currentUserId={currentUserId}
            role={role}
            isReply
          />
        </li>
      ))}
    </ul>
  );
}
