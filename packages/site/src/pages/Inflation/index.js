import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Title from "../../components/Title";
import ResponsivePagination from "../../components/ResponsivePagination";
import SlashTable from "./InflationTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "../../utils/hooks";
import { useHistory } from "react-router";

import {
  fetchInflationList,
  inflationListSelector,
  inflationListLoadingSelector,
} from "../../store/reducers/incomeSlice";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const Inflation = () => {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: itemList, total } = useSelector(inflationListSelector);
  const loading = useSelector(inflationListLoadingSelector);

  useEffect(() => {
    dispatch(fetchInflationList(tablePage - 1, pageSize));
  }, [dispatch, tablePage, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Header>Inflation</Header>
      <SlashTable data={itemList} loading={loading} />
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

export default Inflation;
