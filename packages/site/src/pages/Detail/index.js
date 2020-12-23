import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import InformationTable from "./InformationTable";
import TipLefeCycleTabel from "./TipLifeCycleTable";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 44px;
  color: #1d253c;
`;

const TableWrapper = styled.div`
  display: grid;
  gap: 16px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(1fr);
  }
`;

const Detail = () => {
  return (
    <>
      <HeaderWrapper>
        <NavLink to="/">
          <Image src="./imgs/left-arrow.svg" width={"32px"} height={"32px"} />
        </NavLink>
        <Header>Detail</Header>
      </HeaderWrapper>
      <TableWrapper>
        <InformationTable />
        <TipLefeCycleTabel />
      </TableWrapper>
    </>
  );
};

export default Detail;
