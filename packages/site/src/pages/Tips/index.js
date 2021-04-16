import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import TipsTable from "./TipsTable";
import Filter from "./Filter";
import ResponsivePagination from "../../components/ResponsivePagination";
import Title from "../../components/Title";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTips,
  loadingSelector,
  normalizedTipListSelector,
} from "../../store/reducers/tipSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { useChainRoute, useQuery } from "../../utils/hooks";
import { useHistory } from "react-router";

const HeaderWrapper = styled.div`
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filterData, setFilterData] = useState({});

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: tips, total } = useSelector(normalizedTipListSelector);
  const loading = useSelector(loadingSelector);
  const totalPages = Math.ceil(total / pageSize);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchTips(chain, tablePage - 1, pageSize, filterData));
  }, [dispatch, chain, tablePage, pageSize, filterData]);

  const filterQuery = useCallback((data) => {
    setFilterData(data);
    setTablePage(1);
  }, []);

  return (
    <>
      <HeaderWrapper>
        <Title>Tips</Title>
        <Filter query={filterQuery} />
      </HeaderWrapper>
      <TipsTable data={tips} loading={loading} />
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
    </>
  );
};

export default Tips;
