import { parseInt } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_PAGE,
  USER_ROLES,
} from "../../../constants";
import { TableTitleLabel, TableTitle, TableTitleWrapper } from "./styled";
import { usersCountsSelector } from "../../../store/reducers/usersDetailSlice";
import { useChainRoute, useLocalStorage, useQuery } from "../../../utils/hooks";
import Tag from "../../../components/Tag/Tag";
import TipsTable from "./TipsTable";
import BountiesTable from "./BountiesTable";
import ChildBountiesTable from "./ChildBountiesTable";
import ResponsivePagination from "../../../components/ResponsivePagination";
import { omit } from "lodash";

const TABLE_TABS = {
  Tips: "Tips",
  Bounties: "Bounties",
  ChildBounties: "ChildBounties",
};

export default function ProposalsTable({ role }) {
  useChainRoute();

  const history = useHistory();
  const { address } = useParams();

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

  const searchStatus = useQuery().get("status");
  const [filterData, setFilterData] = useState(() => {
    const v = {};
    if (searchStatus) {
      v.status = searchStatus;
    }
    return v;
  });
  const filterQuery = useCallback(
    (data) => {
      setFilterData(data);
      setTablePage(1);
      history.push({
        search: data.status ? `status=${data.status}` : null,
      });
    },
    [history]
  );

  const counts = useSelector(usersCountsSelector);

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
  const isTips = useMemo(() => tableTab === TABLE_TABS.Tips, [tableTab]);
  const isBounties = useMemo(
    () => tableTab === TABLE_TABS.Bounties,
    [tableTab]
  );
  const isChildBounties = useMemo(
    () => tableTab === TABLE_TABS.ChildBounties,
    [tableTab]
  );

  useEffect(() => {
    history.replace({
      search: null,
    });
    setTablePage(1);
  }, [role, tableTab, history]);

  // prevents:
  // - duplicate http request
  // - duplicate filter data
  useEffect(() => {
    setFilterData((_v) => {
      const v = omit(
        _v,
        Object.values(USER_ROLES).map((r) => r.toLowerCase())
      );

      return {
        ...v,
        [role?.toLowerCase()]: address,
      };
    });
  }, [role, address]);

  const header = (
    <TableTitleWrapper>
      {tableTitles.map((i) => (
        <TableTitle key={i.label} onClick={() => setTableTab(i.label)}>
          <TableTitleLabel active={tableTab === i.label}>
            {i.label}
          </TableTitleLabel>
          {!!i.count && (
            <Tag key={i.label} rounded color="pink" size="small">
              {i.count}
            </Tag>
          )}
        </TableTitle>
      ))}
    </TableTitleWrapper>
  );

  const footer = (totalPages) => (
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
    <>
      {isTips && (
        <TipsTable
          header={header}
          footer={footer}
          tablePage={tablePage}
          pageSize={pageSize}
          filterData={filterData}
          filterQuery={filterQuery}
        />
      )}

      {isBounties && (
        <BountiesTable
          header={header}
          footer={footer}
          tablePage={tablePage}
          pageSize={pageSize}
          filterData={filterData}
        />
      )}

      {isChildBounties && (
        <ChildBountiesTable
          header={header}
          footer={footer}
          tablePage={tablePage}
          pageSize={pageSize}
          filterData={filterData}
        />
      )}
    </>
  );
}
