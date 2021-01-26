import React from "react";
import styled, { css } from "styled-components";
import { Dropdown, Image } from 'semantic-ui-react';

import Text from "./Text";
import TextMinor from "./TextMinor";
import { PRIMARY_THEME_COLOR } from "../constants";

const Wrapper = styled.div`
  margin-bottom: 24px;
`

const Label = styled(Text)`
  font-weight: 500;
  margin-bottom: 8px;
`

const DropdownWrapper = styled.div`
  position: relative;
`

const StyledDropdown = styled(Dropdown)`
  width: 100%;
  height: 64px;
  :active, :focus {
    border-color: ${PRIMARY_THEME_COLOR} !important;
  }
  &.active, & .menu {
    border-color: ${PRIMARY_THEME_COLOR} !important;
  }
  &.ui.dropdown .menu > .item {
    padding: 0 !important;
  }
  .icon {
    top: 50% !important;
    transform: translate(0, -9px) !important;
    opacity: 0.24 !important;
  }
`

const StyledDropdownItem = styled(Dropdown.Item)`
  padding: 0 !important;
`

const ItemWrapper = styled.div`
  height: 64px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  img {
    margin-right: 16px;
  }
  ${p => p.header && css`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    pointer-events: none;
  `}
`

const AccountItem = ({header}) => {
  return (
    <ItemWrapper header={header}>
      <Image src="/imgs/avatar.png" width="40px" />
      <div>
        <Text>Address Name</Text>
        <TextMinor>HUfzjs...yCprsX</TextMinor>
      </div>
    </ItemWrapper>
  )
}

const AccountSelector = () => {
  return (
    <Wrapper>
      <Label>Choose linked account</Label>
      <DropdownWrapper>
        <StyledDropdown selection labeled>
          <Dropdown.Menu>
            <StyledDropdownItem>
              <AccountItem />
            </StyledDropdownItem>
          </Dropdown.Menu>
        </StyledDropdown>
        <AccountItem header />
      </DropdownWrapper>
    </Wrapper>
  )
}

export default AccountSelector;
