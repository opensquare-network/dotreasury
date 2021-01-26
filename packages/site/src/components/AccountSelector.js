import React, { useEffect, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import styled, { css } from "styled-components";
import { Dropdown, Image } from "semantic-ui-react";

import Text from "./Text";
import TextMinor from "./TextMinor";
import { PRIMARY_THEME_COLOR } from "../constants";

import Address from "./Address";

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

const Label = styled(Text)`
  font-weight: 500;
  margin-bottom: 8px;
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const StyledDropdown = styled(Dropdown)`
  width: 100%;
  height: 64px;
  :active,
  :focus {
    border-color: ${PRIMARY_THEME_COLOR} !important;
  }
  &.active,
  & .menu {
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
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  padding: 0 !important;
`;

const ItemWrapper = styled.div`
  height: 64px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  img {
    margin-right: 16px;
  }
  ${(p) =>
    p.header &&
    css`
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      pointer-events: none;
    `}
`;

const AccountItem = ({ header, accountName, accountAddress }) => {
  return (
    <ItemWrapper header={header}>
      <Image src="/imgs/avatar.png" width="40px" />
      <div>
        <Text>{accountName}</Text>
        <TextMinor>
          <Address>{accountAddress}</Address>
        </TextMinor>
      </div>
    </ItemWrapper>
  );
};

const AccountSelector = ({ accounts, onSelect = () => {} }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useDeepCompareEffect(() => {
    onSelect(accounts[selectedIndex]);
  }, [accounts, selectedIndex]);
  return (
    <Wrapper>
      <Label>Choose linked account</Label>
      <DropdownWrapper>
        <StyledDropdown selection labeled>
          <Dropdown.Menu>
            {(accounts || []).map((account, index) => (
              <StyledDropdownItem
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                }}
              >
                <AccountItem
                  accountName={account.name}
                  accountAddress={account.address}
                />
              </StyledDropdownItem>
            ))}
          </Dropdown.Menu>
        </StyledDropdown>
        <AccountItem
          accountName={accounts?.[selectedIndex]?.name}
          accountAddress={accounts?.[selectedIndex]?.address}
          header
        />
      </DropdownWrapper>
    </Wrapper>
  );
};

export default AccountSelector;
