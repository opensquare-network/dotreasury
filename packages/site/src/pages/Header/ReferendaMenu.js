import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalOpenGovApplicationCountSelector } from "../../store/reducers/overviewSlice";

function ReferendaMenu() {
  const applicationCount = useSelector(totalOpenGovApplicationCountSelector);

  return (
    <Menu.Item key="Referenda">
      OpenGov Applications<Label>{applicationCount}</Label>
    </Menu.Item>
  );
}

export default ReferendaMenu;
