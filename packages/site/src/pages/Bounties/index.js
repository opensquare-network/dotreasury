import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";

import ResponsivePagination from "../../components/ResponsivePagination";
import BountiesTable from "./BountiesTable";
import ChildBountiesTable from "./ChildBountiesTable";
import { useDispatch, useSelector } from "react-redux";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";
import { useHistory } from "react-router";

import {
  fetchBounties,
  fetchChildBounties,
  loadingSelector,
  bountyListSelector,
  childBountyListSelector,
} from "../../store/reducers/bountySlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import Text from "../../components/Text";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleGroup = styled.div`
  display: flex;
  gap: 32px;
`;
const Title = styled(Text)`
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.3);

  :hover {
    color: rgba(0, 0, 0, 0.65);
  }

  ${(p) =>
    p.active &&
    css`
      color: rgba(0, 0, 0, 0.9) !important;
    `}
`;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const TYPES = {
  bounties: "bounties",
  childBounties: "child-bounties",
};

const Bounties = () => {
  useChainRoute();

  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "bountiesPageSize",
    DEFAULT_PAGE_SIZE
  );

  // bounties | childBounties
  const [type, setType] = useState(TYPES.bounties);
  const isChildBounties = useMemo(() => type === TYPES.childBounties, [type]);

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: bounties, total: bountiesTotal } =
    useSelector(bountyListSelector);
  const { items: childBounties, total: childBountiesTotal } = useSelector(
    childBountyListSelector
  );
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(
      isChildBounties
        ? fetchChildBounties(chain, tablePage - 1, pageSize)
        : fetchBounties(chain, tablePage - 1, pageSize)
    );
  }, [isChildBounties, dispatch, chain, tablePage, pageSize]);

  const totalPages = useMemo(() => {
    return isChildBounties ? childBountiesTotal : bountiesTotal;
  }, [isChildBounties]);

  const header = (
    <HeaderWrapper>
      <TitleGroup>
        <Title
          active={type === TYPES.bounties}
          onClick={() => {
            setType(TYPES.bounties);
          }}
        >
          Bounties
        </Title>
        <Title
          active={type === TYPES.childBounties}
          onClick={() => {
            setType(TYPES.childBounties);
          }}
        >
          Child Bounties
        </Title>
      </TitleGroup>
    </HeaderWrapper>
  );

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
    <>
      {isChildBounties ? (
        <ChildBountiesTable
          data={childBounties}
          loading={loading}
          header={header}
          footer={footer}
        />
      ) : (
        <BountiesTable
          data={bounties}
          loading={loading}
          header={header}
          footer={footer}
        />
      )}
    </>
  );
};

export default Bounties;
