import React from "react";
import styled from "styled-components";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalOpenGovApplicationCountSelector } from "../../store/reducers/overviewSlice";
import { ReactComponent as ApplicationSVG } from "./applications.svg";

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background-color: var(--neutral300);
  left: 16px;
`;

const Icon = styled(ApplicationSVG)`
  margin-right: 8px;
`;

function ReferendaMenu() {
  const applicationCount = useSelector(totalOpenGovApplicationCountSelector);

  return (
    <Menu.Item key="Referenda">
      <Icon /> Applications<Label>{applicationCount}</Label>
      <Divider />
    </Menu.Item>
  );
}

export default ReferendaMenu;
