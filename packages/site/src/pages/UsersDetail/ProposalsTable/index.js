import { parseInt } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled, { css } from "styled-components";
import Card from "../../../components/Card";
import TableLoading from "../../../components/TableLoading";
import { Table } from "../../../components/Table";
import {
  TEXT_DARK_MAJOR,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_PAGE,
  TEXT_DARK_ACCESSORY,
} from "../../../constants";
import { chainSelector } from "../../../store/reducers/chainSlice";
import {
  proposalsBountiesSelector,
  proposalsChildBountiesSelector,
  proposalsTipsSelector,
  resetUsersProposals,
  fetchUsersProposalsTips,
  fetchUsersProposalsBounties,
  fetchUsersProposalsChildBounties,
  usersCountsSelector,
} from "../../../store/reducers/usersDetailSlice";
import { useChainRoute, useLocalStorage, useQuery } from "../../../utils/hooks";
import { h4_16_semibold } from "../../../styles/text";
import Tag from "../../../components/Tag/Tag";

const CardWrapper = styled(Card)`
  overflow-x: hidden;
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const Wrapper = styled.div`
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow: scroll;
`;

const TableHeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitleLabel = styled.span`
  margin-right: 8px;
  color: ${TEXT_DARK_ACCESSORY};

  ${(p) =>
    p.active &&
    css`
      color: ${TEXT_DARK_MAJOR};
    `}
`;
const TableTitle = styled.h4`
  display: inline-block;
  margin: 0;
  ${h4_16_semibold};

  & + & {
    margin-left: 32px;
  }

  &:hover {
    cursor: pointer;
  }
`;
const TableTitleWrapper = styled.div`
  display: flex;
`;

export default function ProposalsTable({ role }) {
  useChainRoute();

  const chain = useSelector(chainSelector);
  const { address } = useParams();
  const dispatch = useDispatch();

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
  const { items: proposalsTips, total: proposalsTipsTotal } = useSelector(
    proposalsTipsSelector
  );
  const { items: proposalsBounties, total: proposalsBountiesTotal } =
    useSelector(proposalsBountiesSelector);
  const { items: proposalsChildBounties, total: proposalsChildBountiesTotal } =
    useSelector(proposalsChildBountiesSelector);

  useEffect(() => {
    dispatch(
      fetchUsersProposalsTips(chain, address, role, tablePage - 1, pageSize)
    );

    return () => {
      dispatch(resetUsersProposals());
    };
  }, [dispatch, role]);

  const tableTitles = [
    {
      label: "Tips",
      count: counts?.tipsCount,
    },
    {
      label: "Bounties",
      count: counts?.bountiesCount,
    },
    {
      label: "Child Bounties",
      count: counts?.childBountiesCount,
    },
  ];
  const [tableTab, setTableTab] = useState(tableTitles[0].label);

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
          <TableLoading>
            <Table unstackable></Table>
          </TableLoading>
        </TableWrapper>
      </Wrapper>
    </CardWrapper>
  );
}
