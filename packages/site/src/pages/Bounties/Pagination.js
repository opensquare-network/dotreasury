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
        history.push({
          search: null,
        });
      }}
      onPageChange={(_, { activePage }) => {
        history.push({
          search:
            activePage === defaultQueryPage
              ? null
              : `?${pageKey}=${activePage}`,
        });
        setPage(activePage);
      }}
    />
  );
}

export default Pagination;
