import { parseInt } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import TableLoading from "../../../components/TableLoading";
import { Table } from "../../../components/Table";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../../constants";
import { chainSelector } from "../../../store/reducers/chainSlice";
import {
  CardWrapper,
  Wrapper,
  TableWrapper,
  TableHeaderWrapper,
  TableTitleLabel,
  TableTitle,
  TableTitleWrapper,
} from "./styled";
import {
  proposalsBountiesSelector,
  proposalsChildBountiesSelector,
  proposalsTipsSelector,
  resetUsersProposals,
  fetchUsersProposalsTips,
  fetchUsersProposalsBounties,
  fetchUsersProposalsChildBounties,
  proposalsLoadingSelector,
  usersCountsSelector,
} from "../../../store/reducers/usersDetailSlice";
import { useChainRoute, useLocalStorage, useQuery } from "../../../utils/hooks";
import Tag from "../../../components/Tag/Tag";
import ResponsivePagination from "../../../components/ResponsivePagination";

const TABLE_TABS = {
  Tips: "Tips",
  Bounties: "Bounties",
  ChildBounties: "ChildBounties",
};

export default function ProposalsTable({ role }) {
  useChainRoute();

  const chain = useSelector(chainSelector);
  const { address } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "usersPageSize",
    DEFAULT_PAGE_SIZE
  );

  const counts = useSelector(usersCountsSelector);
  const loading = useSelector(proposalsLoadingSelector);
  const { items: proposalsTips, total: proposalsTipsTotal } = useSelector(
    proposalsTipsSelector
  );
  const { items: proposalsBounties, total: proposalsBountiesTotal } =
    useSelector(proposalsBountiesSelector);
  const { items: proposalsChildBounties, total: proposalsChildBountiesTotal } =
    useSelector(proposalsChildBountiesSelector);

  const [tableDataMetas] = useState({
    [TABLE_TABS.Tips]: {
      items: proposalsTips,
      total: proposalsTipsTotal,
    },
    [TABLE_TABS.Bounties]: {
      items: proposalsBounties,
      total: proposalsBountiesTotal,
    },
    [TABLE_TABS.ChildBounties]: {
      items: proposalsChildBounties,
      total: proposalsChildBountiesTotal,
    },
  });

  const [tableFetches] = useState({
    [TABLE_TABS.Tips]: fetchUsersProposalsTips,
    [TABLE_TABS.Bounties]: fetchUsersProposalsBounties,
    [TABLE_TABS.ChildBounties]: fetchUsersProposalsChildBounties,
  });

  const tableTitles = [
    {
      label: TABLE_TABS.Tips,
      count: counts?.tipsCount,
    },
    {
      label: TABLE_TABS.Bounties,
      count: counts?.bountiesCount,
    },
    {
      label: TABLE_TABS.ChildBounties,
      count: counts?.childBountiesCount,
    },
  ];
  const [tableTab, setTableTab] = useState(tableTitles[0].label);

  const tableData = useMemo(() => {
    const { items, total } = tableDataMetas[tableTab];
    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      totalPages,
    };
  }, [tableTab, pageSize, tableDataMetas]);

  useEffect(() => {
    const fetch = tableFetches[tableTab];
    dispatch(fetch(chain, address, role, tablePage - 1, pageSize));

    return () => {
      dispatch(resetUsersProposals());
    };
  }, [
    dispatch,
    chain,
    address,
    role,
    tablePage,
    pageSize,
    tableTab,
    tableFetches,
  ]);

  return (
    <CardWrapper>
      <TableHeaderWrapper>
        <TableTitleWrapper>
          {tableTitles.map((i) => (
            <TableTitle key={i.label} onClick={() => setTableTab(i.label)}>
              <TableTitleLabel active={tableTab === i.label}>
                {i.label}
              </TableTitleLabel>
              {!!i.count && (
                <Tag rounded color="pink" size="small">
                  {i.count}
                </Tag>
              )}
            </TableTitle>
          ))}
        </TableTitleWrapper>
      </TableHeaderWrapper>
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <Table unstackable data={tableData.items}></Table>
          </TableLoading>
        </TableWrapper>
      </Wrapper>

      {tableData.items?.length && (
        <ResponsivePagination
          activePage={tablePage}
          totalPages={tableData.totalPages}
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
    </CardWrapper>
  );
}
