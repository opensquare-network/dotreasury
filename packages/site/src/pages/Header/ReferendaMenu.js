import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalReferendaCountSelector } from "../../store/reducers/overviewSlice";

function ReferendaMenu() {
  const referendaCount = useSelector(totalReferendaCountSelector);

  return (
    <Menu.Item key="Referenda">
      OpenGov Applications<Label>{referendaCount}</Label>
    </Menu.Item>
  );
}

export default ReferendaMenu;
