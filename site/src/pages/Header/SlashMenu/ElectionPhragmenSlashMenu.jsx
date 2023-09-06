import React from "react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { DropdownMenuItem, DropdownMenuLabel } from "./styled";

function ElectionPhragmenSlashMenu({ onClick }) {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <DropdownMenuItem onClick={onClick}>
      <span>Election Phragmen</span>
      <DropdownMenuLabel>{incomeCount.electionPhragmenSlash || 0}</DropdownMenuLabel>
    </DropdownMenuItem>
  );
}

export default ElectionPhragmenSlashMenu;
