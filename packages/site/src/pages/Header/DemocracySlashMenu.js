import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

function DemocracySlashMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="DemocracySlash">
      Democracy<Label>{incomeCount.democracySlash}</Label>
    </Menu.Item>
  );
}

export default DemocracySlashMenu;
