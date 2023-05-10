import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/Button";
import {
  setShowMenuTabs,
  showMenuTabsSelector,
} from "../../store/reducers/menuSlice";
import { useChain } from "../../utils/hooks/chain";

const Wrapper = styled.div`
  margin-right: 32px;
`;

const StyledButton = styled(Button)`
  display: flex !important;
  align-items: center;
  border: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  font-weight: 500 !important;
  ${(p) =>
    p.active &&
    css`
      color: var(--primary) !important;
    `}
  ${(p) =>
    p.chain === "kusama" &&
    css`
      color: var(--textPrimaryContrast) !important;
    `}
  &:hover {
    color: var(--primary) !important;
  }
`;

const MenuSwitch = ({ menuTabsName = "Home" }) => {
  const chain = useChain();
  const dispatch = useDispatch();
  const showMenuTabs = useSelector(showMenuTabsSelector);

  const switcher = useCallback(() => {
    dispatch(setShowMenuTabs(menuTabsName));
  }, [dispatch, menuTabsName]);

  return (
    <Wrapper>
      <StyledButton
        chain={chain}
        active={showMenuTabs === menuTabsName}
        onClick={switcher}
      >
        {menuTabsName}
      </StyledButton>
    </Wrapper>
  );
};

export default MenuSwitch;
