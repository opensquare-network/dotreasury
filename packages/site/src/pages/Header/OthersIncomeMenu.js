import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

function OthersIncomeMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="OthersIncome">
      Big others<Label>{incomeCount.others}</Label>
    </Menu.Item>
  );
}

export default OthersIncomeMenu;
