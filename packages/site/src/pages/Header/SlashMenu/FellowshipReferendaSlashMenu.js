import React from "react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { DropdownMenuItem, DropdownMenuLabel } from "./styled";

function FellowshipReferendaSlashMenu({ onClick }) {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <DropdownMenuItem onClick={onClick}>
      <span>Fellow Referenda</span>
      <DropdownMenuLabel>{incomeCount.fellowshipReferendaSlash || 0}</DropdownMenuLabel>
    </DropdownMenuItem>
  );
}

export default FellowshipReferendaSlashMenu;
