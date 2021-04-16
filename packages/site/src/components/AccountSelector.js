import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Dropdown } from "semantic-ui-react";

import Text from "./Text";

import AccountItem from "./AccountItem";

const Wrapper = styled.div`
  /* margin-bottom: 24px; */
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
  height: 64px !important;
  :active,
  :hover,
  :focus {
    border-color: #cccccc !important;
  }
  &.active,
  & .menu {
    border-color: #cccccc !important;
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

const AccountSelector = ({ chain, accounts, onSelect = () => {} }) => {
  const filteredAccounts = accounts.filter((item) => item[`${chain}Address`]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    onSelect(filteredAccounts[selectedIndex]);
  }, [filteredAccounts, onSelect, selectedIndex]);
  const options = filteredAccounts.map((item, index) => ({
    key: index,
    value: index,
    content: (
      <AccountItem
        accountName={item.name}
        accountAddress={item[`${chain}Address`]}
      />
    ),
  }));
  return (
    <Wrapper>
      <Label>Choose linked account</Label>
      <DropdownWrapper>
        <StyledDropdown
          selection
          options={options}
          onChange={(_, { value }) => {
            setSelectedIndex(value);
          }}
        />
        <AccountItem
          accountName={filteredAccounts?.[selectedIndex]?.name}
          accountAddress={
            filteredAccounts?.[selectedIndex]?.[`${chain}Address`]
          }
          header
        />
      </DropdownWrapper>
    </Wrapper>
  );
};

export default AccountSelector;
