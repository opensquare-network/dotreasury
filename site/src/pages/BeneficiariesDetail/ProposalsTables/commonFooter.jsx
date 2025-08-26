import { useMemo } from "react";
import ResponsivePagination from "../../../components/ResponsivePagination";

export default function CommonFooter({
  total,
  page,
  setPage,
  pageSize,
  setPageSize,
}) {
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handlePageChange = (_, { activePage }) => {
    setPage(activePage);
  };

  const totalPages = useMemo(() => {
    return Math.ceil((total || 0) / pageSize);
  }, [total, pageSize]);

  return (
    <ResponsivePagination
      activePage={page}
      pageSize={pageSize}
      totalPages={totalPages}
      setPageSize={handlePageSizeChange}
      onPageChange={handlePageChange}
    />
  );
}
