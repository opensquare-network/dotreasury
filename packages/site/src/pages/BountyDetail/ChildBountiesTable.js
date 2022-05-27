import { Label } from "semantic-ui-react";
import styled from "styled-components";
import BountiesTable from "../Bounties/BountiesTable";
import { PRIMARY_THEME_COLOR, SECONDARY_THEME_COLOR } from "../../constants";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useHistory } from "react-router";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import { useMemo, useState } from "react";

const Wrapper = styled.div`
  margin-top: 24px;
`;

const Header = styled.div`
  max-width: 100%;
  padding: 20px 24px;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.9);
  display: flex;

  div.ui.label {
    background: ${SECONDARY_THEME_COLOR} !important;
    height: 20px !important;
    padding: 0 8px !important;
    line-height: 20px !important;
    border-radius: 10px !important;
    margin-left: 8px !important;
    color: ${PRIMARY_THEME_COLOR} !important;
    font-weight: 400;
  }
`;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

function ChildBountiesTable() {
  const history = useHistory();

  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "bountiesDetailChildBountiesPageSize",
    DEFAULT_PAGE_SIZE
  );
  const totalPages = useMemo(() => {
    return Math.ceil(1 / pageSize);
  }, [pageSize]);

  const footer = (
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
            activePage === DEFAULT_QUERY_PAGE ? null : `?page=${activePage}`,
        });
        setTablePage(activePage);
      }}
    />
  );

  return (
    <Wrapper>
      <BountiesTable
        header={
          <Header>
            <span>Child Bounties</span>
            <Label>0</Label>
          </Header>
        }
        footer={footer}
      />
    </Wrapper>
  );
}

export default ChildBountiesTable;
