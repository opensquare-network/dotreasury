import React from "react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { DropdownMenuItem, DropdownMenuLabel } from "./styled";

function IdentitySlashMenu({ onClick }) {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <DropdownMenuItem onClick={onClick}>
      <span>Identity</span>
      <DropdownMenuLabel>{incomeCount.identitySlash || 0}</DropdownMenuLabel>
    </DropdownMenuItem>
  );
}

export default IdentitySlashMenu;
