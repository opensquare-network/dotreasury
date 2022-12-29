import React from "react";
import styled from "styled-components";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalOpenGovApplicationCountSelector } from "../../store/reducers/overviewSlice";

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background: #eeeeee;
  left: 16px;
`;

function ReferendaMenu() {
  const applicationCount = useSelector(totalOpenGovApplicationCountSelector);

  return (
    <Menu.Item key="Referenda">
      OpenGov Applications<Label>{applicationCount}</Label>
      <Divider />
    </Menu.Item>
  );
}

export default ReferendaMenu;
