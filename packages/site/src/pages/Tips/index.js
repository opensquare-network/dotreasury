/* eslint-disable */
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
  const testData = [
    {
      beneficiary: {
        name: "Eleanor",
        address: "HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX",
      },
      finder: {
        address: "HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX",
      },
      reason: "https://kusama.polkassembly.io/post/346",
      balance: {
        value: "50.00",
      },
      status: {
        status: "Closed",
        time: "12h 34min ago",
      },
    },
    {
      beneficiary: {
        address: "HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX",
      },
      finder: {
        name: "Eleanor",
        address: "HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX",
      },
      reason: "My second video about Kusama Network",
      balance: {
        value: "3.50",
      },
      status: {
        status: "Tipping (2)",
      },
    },
  ];

  const [tablePage, setTablePage] = useState(1);

  const dispatch = useDispatch();
  const { items: tips, page, pageSize, total } = useSelector(tipListSelector);
  const tablePageTotal = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(fetchTips(tablePage - 1, 50));
  }, [dispatch, tablePage]);

  return (
    <>
      <Header>Tips</Header>
      <TipsTable data={tips} />
      <Pagination
        boundaryRange={0}
        defaultActivePage={1}
        ellipsisItem={null}
        firstItem={null}
        lastItem={null}
        siblingRange={1}
        totalPages={tablePageTotal}
        onPageChange={(_, data) => {
          setTablePage(data.activePage);
          setTablePageSize(pageSize);
        }}
      />
    </>
  );
};

export default Tips;
