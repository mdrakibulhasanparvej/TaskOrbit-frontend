import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  ContactMessage,
  ContactPayload,
  ContactStatusPayload,
  Query,
} from "@/types";

// Contact routes (plan.md §9):
//   POST  /contact/       public form
//   GET   /contact?status= ADMIN inbox (paginated)
//   PATCH /contact/:id    ADMIN status update
const prefix = "/contact";

/** C1 — POST /contact (public — anyone can submit). */
export const createContactMessage = (payload: ContactPayload) => {
  return apiClient<ApiResponse<ContactMessage>>(prefix, {
    method: "POST",
    body: payload,
  });
};

/** C2 — GET /contact (ADMIN inbox, paginated, optional status filter). */
export const getContactMessages = (query: Query = {}) => {
  return apiClient<ApiResponse<ContactMessage[]>>(prefix, { query });
};

/** C3 — PATCH /contact/:id {status} (ADMIN). */
export const updateContactMessageStatus = (
  messageId: string,
  payload: ContactStatusPayload,
) => {
  return apiClient<ApiResponse<ContactMessage>>(`${prefix}/${messageId}`, {
    method: "PATCH",
    body: payload,
  });
};
