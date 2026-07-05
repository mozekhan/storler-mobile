import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const nextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const goToPage = useCallback((pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pages) {
      setPage(pageNumber);
    }
  }, [pages]);

  const resetPagination = useCallback(() => {
    setPage(1);
    setTotal(0);
    setPages(0);
  }, []);

  const updatePagination = useCallback((data) => {
    if (data?.pagination) {
      setTotal(data.pagination.total);
      setPages(data.pagination.pages);
    }
  }, []);

  return {
    page,
    limit,
    total,
    pages,
    setPage,
    setLimit,
    setTotal,
    setPages,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
    updatePagination,
  };
}

export default usePagination;