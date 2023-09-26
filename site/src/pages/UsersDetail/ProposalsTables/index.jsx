import { parseInt } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../../constants";
import { TableTitleLabel, TableTitle, TableTitleWrapper } from "./styled";
import { usersCountsSelector } from "../../../store/reducers/usersDetailSlice";
import { useLocalStorage, useQuery } from "../../../utils/hooks";
import Tag from "../../../components/Tag/Tag";
import ProposalsTable from "./ProposalsTable";
import TipsTable from "./TipsTable";
import BountiesTable from "./BountiesTable";
import ChildBountiesTable from "./ChildBountiesTable";
import ResponsivePagination from "../../../components/ResponsivePagination";
import { Link } from "react-router-dom";

const TABLE_TABS = {
  Proposals: "proposals",
  Tips: "tips",
  Bounties: "bounties",
  ChildBounties: "child-bounties",
};

export default function ProposalsTables({ role }) {
  const history = useHistory();
  const location = useLocation();
  const { address, tableTab: tableTabParam } = useParams();

  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "usersPageSize",
    DEFAULT_PAGE_SIZE,
  );

  const [filterData] = useState({});
  const counts = useSelector(usersCountsSelector);

  const tableTitles = useMemo(
    () => [
      {
        label: TABLE_TABS.Proposals,
        count: counts?.proposalsCount,
      },
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
    ],
    [counts],
  );
  const [tableTab, setTableTab] = useState(
    tableTabParam || tableTitles[0].label,
  );

  useEffect(() => {
    history.replace({
      search: location.search,
      pathname: `/users/${address}/${role}/${
        tableTab ? tableTab : tableTitles[0].label
      }`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTableTab(tableTabParam);
  }, [role, tableTabParam]);

  const header = (
    <TableTitleWrapper>
      {tableTitles.map((i) => (
        <TableTitle key={i.label} active={tableTab === i.label}>
          <Link to={`${i.label}`}>
            <TableTitleLabel>{i.label.replace("-", " ")}</TableTitleLabel>
            {!!i.count && (
              <Tag key={i.label} rounded color="pink" size="small">
                {i.count}
              </Tag>
            )}
          </Link>
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
      <Tables
        header={header}
        footer={footer}
        tablePage={tablePage}
        pageSize={pageSize}
        filterData={filterData}
        role={role}
        address={address}
      />
    </>
  );
}

function Tables({
  header,
  footer,
  tablePage,
  pageSize,
  filterData,
  role,
  address,
}) {
  const { tableTab } = useParams();

  const isProposals = useMemo(
    () => tableTab === TABLE_TABS.Proposals,
    [tableTab],
  );
  const isTips = useMemo(() => tableTab === TABLE_TABS.Tips, [tableTab]);
  const isBounties = useMemo(
    () => tableTab === TABLE_TABS.Bounties,
    [tableTab],
  );
  const isChildBounties = useMemo(
    () => tableTab === TABLE_TABS.ChildBounties,
    [tableTab],
  );

  return (
    <>
      {isProposals && (
        <ProposalsTable
          header={header}
          footer={footer}
          tablePage={tablePage}
          pageSize={pageSize}
          filterData={filterData}
          role={role}
          address={address}
        />
      )}

      {isTips && (
        <TipsTable
          header={header}
          footer={footer}
          tablePage={tablePage}
          pageSize={pageSize}
          filterData={filterData}
          role={role}
          address={address}
        />
      )}

      {isBounties && (
        <BountiesTable
          header={header}
          footer={footer}
          tablePage={tablePage}
          pageSize={pageSize}
          filterData={filterData}
          role={role}
          address={address}
        />
      )}

      {isChildBounties && (
        <ChildBountiesTable
          header={header}
          footer={footer}
          tablePage={tablePage}
          pageSize={pageSize}
          filterData={filterData}
          role={role}
          address={address}
        />
      )}
    </>
  );
}
