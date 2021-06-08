import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/Button";
import {
  setShowMenuTabs,
  showMenuTabsSelector,
} from "../../store/reducers/menuSlice";
import { PRIMARY_THEME_COLOR } from "../../constants";

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
      color: ${PRIMARY_THEME_COLOR} !important;
    `}
  &:hover {
    color: ${PRIMARY_THEME_COLOR} !important;
  }
`;

const MenuSwitch = ({ menuTabsName = "Home" }) => {
  const dispatch = useDispatch();
  const showMenuTabs = useSelector(showMenuTabsSelector);

  const switcher = useCallback(() => {
    dispatch(setShowMenuTabs(menuTabsName));
  }, [dispatch, menuTabsName]);

  return (
    <Wrapper>
      <StyledButton active={showMenuTabs === menuTabsName} onClick={switcher}>
        {menuTabsName}
      </StyledButton>
    </Wrapper>
  );
};

export default MenuSwitch;
