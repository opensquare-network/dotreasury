import { useSelector } from "react-redux";
import { Table } from "../../../components/Table";
import { proposalsTipsSelector } from "../../../store/reducers/usersDetailSlice";
import { useTableColumns } from "../../../components/shared/useTableColumns";
import { noop } from "lodash";
import { DEFAULT_QUERY_PAGE } from "../../../constants";
import { TableWrapper } from "./styled";
import ResponsivePagination from "../../../components/ResponsivePagination";
import { useHistory } from "react-router";

export default function TipsTable({
  tablePage,
  setTablePage = noop,
  pageSize,
  setPageSize = noop,
}) {
  const history = useHistory();
  const { items, total } = useSelector(proposalsTipsSelector);

  const { tipsBeneficiary, finder, reason, tipsValue, tipsStatus } =
    useTableColumns();

  const columns = [tipsBeneficiary, finder, reason, tipsValue, tipsStatus];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <TableWrapper>
        <Table data={items} columns={columns} />
      </TableWrapper>

      {items?.length && (
        <ResponsivePagination
          activePage={tablePage}
          totalPages={totalPages}
          pageSize={pageSize}
          setPageSize={(pageSize) => {
            setTablePage(DEFAULT_QUERY_PAGE);
            setPageSize(pageSize);
            history.push({
              search: null,
            });
          }}
          onPageChange={(_, { activePage }) => {
            history.push({
              search:
                activePage === DEFAULT_QUERY_PAGE
                  ? null
                  : `?page=${activePage}`,
            });
            setTablePage(activePage);
          }}
        />
      )}
    </>
  );
}
