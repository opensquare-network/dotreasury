import React from "react";
import styled from "styled-components";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { ReactComponent as ApplicationSVG } from "./applications.svg";

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background: #eeeeee;
  left: 16px;
`;

const Icon = styled(ApplicationSVG)`
  margin-right: 8px;
`;

function ReferendaMenu() {
  const { count } = useSelector(overviewSelector);
  const { referenda } = count;

  return (
    <Menu.Item key="Referenda">
      <Icon /> Applications<Label>{referenda.active || 0}</Label>
      <Divider />
    </Menu.Item>
  );
}

export default ReferendaMenu;
