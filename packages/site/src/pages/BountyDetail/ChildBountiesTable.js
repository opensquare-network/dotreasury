import { Label } from "semantic-ui-react";
import styled from "styled-components";
import BountiesTable from "../Bounties/BountiesTable";
import { PRIMARY_THEME_COLOR, SECONDARY_THEME_COLOR } from "../../constants";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchChildBountiesByParentIndex,
  childBountyByParentIndexListSelector,
  loadingSelector,
} from "../../store/reducers/bountySlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { compatChildBountyData } from "../ChildBounties/utils";

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
const PAGE_KEY = "child-bounties-page";

function ChildBountiesTable({ index }) {
  const dispatch = useDispatch();

  const searchPage = parseInt(useQuery().get(PAGE_KEY));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "bountiesDetailChildBountiesPageSize",
    DEFAULT_PAGE_SIZE
  );

  const { items: childBounties, total } = useSelector(
    childBountyByParentIndexListSelector
  );
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(
      fetchChildBountiesByParentIndex(chain, index, tablePage - 1, pageSize)
    );
  }, [dispatch, chain, index, tablePage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const tableData = useMemo(() => {
    return childBounties.map(compatChildBountyData);
  }, [childBounties]);

  const header = (
    <Header>
      <span>Child Bounties</span>
      <Label>{total}</Label>
    </Header>
  );

  const footer = (
    <ResponsivePagination
      activePage={tablePage}
      totalPages={totalPages}
      pageSize={pageSize}
      setPageSize={(pageSize) => {
        setTablePage(DEFAULT_QUERY_PAGE);
        setPageSize(pageSize);
      }}
      onPageChange={(_, { activePage }) => {
        setTablePage(activePage);
      }}
    />
  );

  return (
    <Wrapper>
      <BountiesTable
        loading={loading}
        data={tableData}
        header={header}
        footer={footer}
        rowProps={{ routable: false }}
      />
    </Wrapper>
  );
}

export default ChildBountiesTable;
