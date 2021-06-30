import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import TipsTable from "./TipsTable";
import Filter from "./Filter";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTips,
  loadingSelector,
  normalizedTipListSelector,
} from "../../store/reducers/tipSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";
import { useHistory } from "react-router";
import Text from "../../components/Text";

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

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const Tips = () => {
  useChainRoute();

  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const searchStatus = useQuery().get("status");

  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "tipsPageSize",
    DEFAULT_PAGE_SIZE
  );
  const [filterData, setFilterData] = useState(
    searchStatus
      ? {
          status: searchStatus,
        }
      : {}
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: tips, total } = useSelector(normalizedTipListSelector);
  const loading = useSelector(loadingSelector);
  const totalPages = Math.ceil(total / pageSize);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchTips(chain, tablePage - 1, pageSize, filterData));
  }, [dispatch, chain, tablePage, pageSize, filterData]);

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

  return (
    <>
      <TipsTable
        data={tips}
        loading={loading}
        header={
          <HeaderWrapper>
            <Title>Tips</Title>
            <Filter value={filterData.status ?? "-1"} query={filterQuery} />
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

export default Tips;
