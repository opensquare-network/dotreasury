import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TipsTable from "./TipsTable";
import ResponsivePagination from "../../components/ResponsivePagination";
import Title from "../../components/Title";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTips,
  loadingSelector,
  normalizedTipListSelector,
} from "../../store/reducers/tipSlice";
import { useQuery } from "../../utils/hooks";
import { useHistory } from "react-router";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEDAULT_QUERY_PAGE = 1;

const Tips = () => {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage = searchPage && !isNaN(searchPage) && searchPage > 0 ? searchPage : DEDAULT_QUERY_PAGE;

  const [tablePage, setTablePage] = useState(queryPage);

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: tips, total } = useSelector(normalizedTipListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  useEffect(() => {
    dispatch(fetchTips(tablePage - 1, DEFAULT_PAGE_SIZE));
  }, [dispatch, tablePage]);


  return (
    <>
      <Header>Tips</Header>
      <TipsTable data={tips} loading={loading} />
      <ResponsivePagination
        activePage={tablePage}
        totalPages={totalPages}
        onPageChange={(_, { activePage }) => {
          history.push({
            search: activePage === DEDAULT_QUERY_PAGE ? null : `?page=${activePage}`
          });
          setTablePage(activePage);
        }}
      />
    </>
  );
};

export default Tips;
