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
          history.push({
            search: null,
          });
        }
      }}
      onPageChange={(_, { activePage }) => {
        if (persist) {
          history.push({
            search:
              activePage === defaultQueryPage
                ? null
                : `?${pageKey}=${activePage}`,
          });
        }
        setPage(activePage);
      }}
    />
  );
}

export default Pagination;
