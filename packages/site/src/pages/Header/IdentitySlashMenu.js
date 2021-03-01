import React from "react";
import styled from "styled-components";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../store/reducers/incomeSlice";

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background: #eeeeee;
  left: 16px;
`;

function IdentitySlashMenu() {
  const incomeCount = useSelector(incomeCountSelector);

  return (
    <Menu.Item key="IdentitySlash">
      Identity<Label>{incomeCount.identitySlash}</Label>
      <Divider />
    </Menu.Item>
  );
}

export default IdentitySlashMenu;
