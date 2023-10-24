import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";
import styled from "styled-components";

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background: var(--neutral300);
  left: 16px;
`;

function BlockRewardsIncomeMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="GasFeeIncome">
      Block Rewards
      <Label>{incomeCount.centrifugeBlockRewards}</Label>
      <Divider />
    </Menu.Item>
  );
}

export default BlockRewardsIncomeMenu;
