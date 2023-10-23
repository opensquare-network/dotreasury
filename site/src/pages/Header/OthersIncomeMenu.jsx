import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";
import { IS_CENTRIFUGE } from "../../utils/chains";

function OthersIncomeMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="OthersIncome">
      {IS_CENTRIFUGE ? "Others" : "Big others"}
      <Label>{incomeCount.others}</Label>
    </Menu.Item>
  );
}

export default OthersIncomeMenu;
