import React, { useEffect, useState } from "react";
import styled from "styled-components";

import TipsTable from "./TipsTable";
import Pagination from "../../components/Pagination";
import Title from "../../components/Title";
import { useDispatch, useSelector } from "react-redux";
import { fetchTips, tipListSelector } from "../../store/reducers/tipSlice";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const Tips = () => {
  const [tablePage, setTablePage] = useState(1);

  const dispatch = useDispatch();
  const { items: tips, total } = useSelector(tipListSelector);

  useEffect(() => {
    dispatch(fetchTips(tablePage - 1, 50));
  }, [dispatch, tablePage]);

  return (
    <>
      <Header>Tips</Header>
      <TipsTable data={tips}/>
      <Pagination
        activePage={tablePage}
        totalPages={total}
        onPageChange={(_, { activePage }) => {
          setTablePage(activePage);
        }}
      />
    </>
  );
};

export default Tips;
