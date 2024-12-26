import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationControls({
  query,
  sort,
  sortDirection,
  currentPage,
  pagination,
}) {
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", page);
    searchParams.set("sort", sort);
    searchParams.set("sortDirection", sortDirection);
    if (query) {
      searchParams.set("search", query);
    }
    navigate(`?${searchParams.toString()}`);
  };

  const renderPageLinks = () => {
    const pageLinks = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageLinks.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pageLinks.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="px-2 py-1" />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(
        <PaginationItem key={i}>
          <PaginationLink
            className={`${
              i === currentPage
                ? "bg-btn hover:bg-blue-600 text-white hover:text-white"
                : "bg-transparent"
            }`}
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pageLinks.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="px-2 py-1" />
          </PaginationItem>
        );
      }
      pageLinks.push(
        <PaginationItem key={pagination.totalPages}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(pagination.totalPages);
            }}
          >
            {pagination.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageLinks;
  };

  return (
    <div>
      {/* <p>{`Showing ${pagination.limit} items per page`}</p> */}
      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            {pagination.previousPage ? (
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              />
            ) : (
              <PaginationPrevious disabled />
            )}
          </PaginationItem>
          {renderPageLinks()}
          <PaginationItem>
            {pagination.nextPage ? (
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
              />
            ) : (
              <PaginationNext disabled />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
