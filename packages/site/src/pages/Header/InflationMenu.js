import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

function InflationMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="Inflation">
      Inflation<Label>{incomeCount.inflation}</Label>
    </Menu.Item>
  );
}

export default InflationMenu;
