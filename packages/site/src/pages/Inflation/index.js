import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ResponsivePagination from "../../components/ResponsivePagination";
import SlashTable from "./InflationTable";
import { useDispatch, useSelector } from "react-redux";
import { useChainRoute, useQuery, usePageStorage } from "../../utils/hooks";
import {
  fetchInflationList,
  inflationListSelector,
  inflationListLoadingSelector,
} from "../../store/reducers/incomeSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import Text from "../../components/Text";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  align-items: flex-end;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

const SubTitle = styled.span`
  margin-left: 8px;
  font-size: 12px;
  color: rgba(29, 37, 60, 0.24);
  font-family: Inter;
  font-weight: normal;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const Inflation = () => {
  useChainRoute();

  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = usePageStorage("inflationPage", queryPage);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const dispatch = useDispatch();
  const { items: itemList, total } = useSelector(inflationListSelector);
  const loading = useSelector(inflationListLoadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchInflationList(chain, tablePage - 1, pageSize));
  }, [dispatch, chain, tablePage, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <SlashTable
        data={itemList}
        loading={loading}
        header={
          <HeaderWrapper>
            <Title>Inflation</Title>
            <SubTitle>Staking Remaining</SubTitle>
          </HeaderWrapper>
        }
        footer={
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
        }
      />
    </>
  );
};

export default Inflation;
