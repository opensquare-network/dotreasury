import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

function StakingSlashMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="StakingSlash">
      Staking<Label>{incomeCount.stakingSlash}</Label>
    </Menu.Item>
  );
}

export default StakingSlashMenu;
