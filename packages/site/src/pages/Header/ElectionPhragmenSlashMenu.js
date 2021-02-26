import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

function ElectionPhragmenSlashMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="electionPhragmenSlash">
      Election<Label>{incomeCount.electionPhragmenSlash}</Label>
    </Menu.Item>
  );
}

export default ElectionPhragmenSlashMenu;
