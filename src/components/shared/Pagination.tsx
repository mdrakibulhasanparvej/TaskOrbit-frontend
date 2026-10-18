/** biome-ignore-all lint/suspicious/noArrayIndexKey: <no need for index> */
"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function MyPagination({
  totalPages,
  page = 1,
  handlePageChange,
}: {
  totalPages: number;
  page?: number;
  handlePageChange: Dispatch<SetStateAction<number>>;
}) {
  const getButtonArray = (
    totalPages: number,
    page: number,
  ): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (totalPages >= 50 && page >= 6 && totalPages - page > 4) {
      return [
        1,
        2,
        3,
        "ellipsis",
        page - 1,
        page,
        page + 1,
        "ellipsis",
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    if (totalPages > 7 && page < 5) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages - 1, totalPages];
    }

    if (totalPages - page <= 4) {
      return [
        1,
        2,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    if (totalPages - page > 3) {
      return [
        1,
        2,
        "ellipsis",
        page - 1,
        page,
        page + 1,
        "ellipsis",
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const goToPage = (nextPage: number) => {
    handlePageChange(nextPage);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent className="flex gap-2">
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page === 1}
            className={
              page === 1 ? "pointer-events-none opacity-50" : undefined
            }
            onClick={() => goToPage(page - 1)}
          />
        </PaginationItem>

        {getButtonArray(totalPages, page).map((item, i) => {
          const isActive = page === item;
          return item === "ellipsis" ? (
            <PaginationItem key={i}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={i}>
              <Button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => goToPage(item)}
                variant={isActive ? "default" : "outline"}
                key={`${totalPages}-${i}`}
              >
                {" "}
                {item}
              </Button>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : undefined
            }
            onClick={() => goToPage(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
