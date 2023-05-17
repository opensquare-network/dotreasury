import React from "react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { DropdownMenuItem, DropdownMenuLabel } from "./styled";

function TreasurySlashMenu({ onClick }) {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <DropdownMenuItem onClick={onClick}>
      <span>Treasury</span>
      <DropdownMenuLabel>{incomeCount.treasurySlash || 0}</DropdownMenuLabel>
    </DropdownMenuItem>
  );
}

export default TreasurySlashMenu;
