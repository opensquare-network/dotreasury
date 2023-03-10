import React from "react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { DropdownMenuItem, DropdownMenuLabel } from "./styled";

function ReferendaSlashMenu({ onClick }) {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <DropdownMenuItem onClick={onClick}>
      <span>Referenda</span>
      <DropdownMenuLabel>{incomeCount.referendaSlash || 0}</DropdownMenuLabel>
    </DropdownMenuItem>
  );
}

export default ReferendaSlashMenu;
