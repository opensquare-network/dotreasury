import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/Button";
import {
  setShowMenuTabs,
  showMenuTabsSelector,
} from "../../store/reducers/menuSlice";
import { isKusama } from "../../utils/chains";

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
  ${() =>
    isKusama &&
    css`
      color: var(--textPrimaryContrast) !important;
    `}
  &:hover {
    color: var(--primary) !important;
  }
`;

const MenuSwitch = ({ menuTabsName = "Home", preventDefault = false }) => {
  const dispatch = useDispatch();
  const showMenuTabs = useSelector(showMenuTabsSelector);
  const isActive = showMenuTabs === menuTabsName;

  const switcher = useCallback(
    (e) => {
      if (preventDefault) {
        e.preventDefault();
        return;
      }
      dispatch(setShowMenuTabs(menuTabsName));
    },
    [dispatch, menuTabsName, preventDefault],
  );

  return (
    <Wrapper>
      <StyledButton onClick={switcher}>
        <span style={isActive ? { color: "var(--primary) !important" } : {}}>
          {menuTabsName}
        </span>
      </StyledButton>
    </Wrapper>
  );
};

export default MenuSwitch;
