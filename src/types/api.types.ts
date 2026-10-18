export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Meta;
}

export interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  dataCount?: number;
}

export interface Query {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;

  // biome-ignore lint/suspicious/noExplicitAny: <flexible query params>
  [key: string]: any;
}
