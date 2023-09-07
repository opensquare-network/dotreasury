import React from "react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { DropdownMenuItem, DropdownMenuLabel } from "./styled";

function DemocracySlashMenu({ onClick }) {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <DropdownMenuItem onClick={onClick}>
      <span>Democracy</span>
      <DropdownMenuLabel>{incomeCount.democracySlash || 0}</DropdownMenuLabel>
    </DropdownMenuItem>
  );
}

export default DemocracySlashMenu;
