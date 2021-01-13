import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalTipCountSelector } from "../../store/reducers/overviewSlice";

function TipsMenu() {
  const tipsCount = useSelector(totalTipCountSelector);

  return (
    <Menu.Item key="Tips">
      Tips<Label>{tipsCount}</Label>
    </Menu.Item>
  );
}

export default TipsMenu;
