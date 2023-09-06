// @ts-check

import ResponsivePagination from "../../components/ResponsivePagination";
import { useHistory } from "react-router";

function Pagination({
  page,
  setPage,
  totalPages,
  pageSize,
  setPageSize,
  pageKey = "page",
  defaultQueryPage,
  persist = true,
}) {
  const history = useHistory();
  return (
    <ResponsivePagination
      activePage={page}
      totalPages={totalPages}
      pageSize={pageSize}
      setPageSize={(pageSize) => {
        setPage(defaultQueryPage);
        setPageSize(pageSize);
        if (persist) {
          const searchParams = new URLSearchParams(history.location.search);
          searchParams.delete(pageKey);
          history.push({ search: searchParams.toString() });
        }
      }}
      onPageChange={(_, { activePage }) => {
        if (persist) {
          const searchParams = new URLSearchParams(history.location.search);
          if (activePage === defaultQueryPage) {
            searchParams.delete(pageKey);
          } else {
            searchParams.set(pageKey, activePage);
          }
          history.push({ search: searchParams.toString() });
        }
        setPage(activePage);
      }}
    />
  );
}

export default Pagination;
