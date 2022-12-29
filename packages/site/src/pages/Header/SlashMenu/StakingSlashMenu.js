import React from "react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { DropdownMenuItem, DropdownMenuLabel } from "./styled";

function StakingSlashMenu({ onClick }) {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <DropdownMenuItem onClick={onClick}>
      <span>Staking</span>
      <DropdownMenuLabel>{incomeCount.stakingSlash || 0}</DropdownMenuLabel>
    </DropdownMenuItem>
  );
}

export default StakingSlashMenu;
