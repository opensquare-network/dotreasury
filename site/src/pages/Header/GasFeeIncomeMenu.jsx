import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

function GasFeeIncomeMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="GasFeeIncome">
      Gas Fee
      {/* FIXME: centrifuge gas fee count */}
      <Label>{incomeCount.transfer}</Label>
    </Menu.Item>
  );
}

export default GasFeeIncomeMenu;
