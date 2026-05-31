import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalCount,
  perPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / perPage);
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "primary" : "ghost"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </Button>
    </div>
  );
}
