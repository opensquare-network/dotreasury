import React, { useEffect, useState } from "react";

import ResponsivePagination from "../../components/ResponsivePagination";
import BurntTable from "./BurntTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import { useHistory } from "react-router";

import {
  fetchBurntList,
  burntListSelector,
  loadingBurntListSelector,
  burntChartSelector,
  fetchBurntChart,
} from "../../store/reducers/burntSlice";

import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";

const Burnt = () => {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "burntStorage",
    DEFAULT_PAGE_SIZE,
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: burntList, total } = useSelector(burntListSelector);
  const chartData = useSelector(burntChartSelector);
  const loading = useSelector(loadingBurntListSelector);

  useEffect(() => {
    dispatch(fetchBurntList(tablePage - 1, pageSize));
    dispatch(fetchBurntChart());
  }, [dispatch, tablePage, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <BurntTable
        chartData={chartData}
        data={burntList}
        loading={loading}
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

export default Burnt;
