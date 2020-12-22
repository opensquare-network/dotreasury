import React from "react";
import styled from "styled-components";

import TipsTable from "./TipsTable";

const Header = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 44px;
  color: #1d253c;
  margin-bottom: 20px;
`;

const Tips = () => {
  return (
    <>
      <Header>Tips</Header>
      <TipsTable />
    </>
  );
};

export default Tips;
