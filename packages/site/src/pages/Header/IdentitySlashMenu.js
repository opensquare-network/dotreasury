import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

function IdentitySlashMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="IdentitySlash">
      Identity<Label>{incomeCount.identitySlash}</Label>
    </Menu.Item>
  );
}

export default IdentitySlashMenu;
