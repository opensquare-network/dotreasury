import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import TipsTable from "./TipsTable";
import Pagination from "../../components/Pagination";
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

const LoadingWrapper = styled.div`
  background: white;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-top: 0;
  border-bottom-left-radius: 0.285rem;
  border-bottom-right-radius: 0.285rem;
`;

const Tips = () => {
  const [tablePage, setTablePage] = useState(1);

  const dispatch = useDispatch();
  const { items: tips, total } = useSelector(normalizedTipListSelector);
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchTips(tablePage - 1, 30));
  }, [dispatch, tablePage]);

  return (
    <>
      <Header>Tips</Header>
      <TipsTable data={tips} />
      {loading && (
        <LoadingWrapper>
          <Image src={"./imgs/loading.svg"} />
        </LoadingWrapper>
      )}
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
