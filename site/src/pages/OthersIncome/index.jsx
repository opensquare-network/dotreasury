import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ResponsivePagination from "../../components/ResponsivePagination";
import OthersIncomeTable from "./OthersIncomeTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import { useHistory } from "react-router";

import {
  fetchOthersIncomeList,
  othersIncomeListSelector,
  othersIncomeListLoadingSelector,
} from "../../store/reducers/incomeSlice";
import Text from "../../components/Text";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import { IS_CENTRIFUGE } from "../../utils/chains";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

const OthersIncome = () => {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "othersPageSize",
    DEFAULT_PAGE_SIZE,
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: itemList, total } = useSelector(othersIncomeListSelector);
  const loading = useSelector(othersIncomeListLoadingSelector);

  useEffect(() => {
    dispatch(fetchOthersIncomeList(tablePage - 1, pageSize));
  }, [dispatch, tablePage, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <OthersIncomeTable
        data={itemList}
        loading={loading}
        header={
          <HeaderWrapper>
            <Title>{IS_CENTRIFUGE ? "Others" : "Big others"}</Title>
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
        }
      />
    </>
  );
};

export default OthersIncome;
