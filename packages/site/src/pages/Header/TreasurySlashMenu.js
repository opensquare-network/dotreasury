import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

function TreasurySlashMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="TreasurySlash">
      Treasury<Label>{incomeCount.treasurySlash}</Label>
    </Menu.Item>
  );
}

export default TreasurySlashMenu;
