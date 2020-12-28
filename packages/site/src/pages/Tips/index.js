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

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const DEFAULT_PAGE_SIZE = 20;


const Tips = () => {
  const [tablePage, setTablePage] = useState(1);

  const dispatch = useDispatch();
  const { items: tips, total } = useSelector(normalizedTipListSelector);
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchTips(tablePage - 1, DEFAULT_PAGE_SIZE));
  }, [dispatch, tablePage]);

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  return (
    <>
      <Header>Tips</Header>
      <TipsTable data={tips} loading={loading} />
      <ResponsivePagination
        activePage={tablePage}
        totalPages={totalPages}
        onPageChange={(_, { activePage }) => {
          setTablePage(activePage);
        }}
      />
    </>
  );
};

export default Tips;
