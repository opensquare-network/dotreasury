import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Dropdown } from "semantic-ui-react";
import { encodeAddress } from "@polkadot/util-crypto";

import Text from "../Text";
import AccountItem from "./AccountItem";
import { bg, hover } from "../../styles/tailwindcss";
import { CHAINS } from "../../constants";

const Wrapper = styled.div``;

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
  background-color: var(--neutral100) !important;
  border-color: var(--neutral400) !important;
  :active,
  :hover,
  :focus {
    border-color: var(--neutral500) !important;
  }
  &.active,
  & .menu {
    border-color: var(--neutral500) !important;
    background-color: var(--neutral100) !important;
  }
  &.ui.dropdown .menu > .item {
    padding: 0 !important;
    border-color: var(--neutral400) !important;
    ${hover(bg("neutral200"))};
  }
  .icon {
    top: 50% !important;
    transform: translate(0, -9px) !important;
    color: var(--textTertiary);
  }
`;

const getSS58Prefix = (chain) => {
  if (chain === CHAINS.KUSAMA) {
    return 2;
  } else if (chain === CHAINS.POLKADOT) {
    return 0;
  } else {
    return 42;
  }
};

const AccountSelector = ({ chain, accounts, onSelect = () => {} }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  useEffect(() => {
    const filteredAccounts = accounts
      .filter((item) => item.type !== "ethereum")
      .map((item) => ({
        ...item,
        address: encodeAddress(item.address, getSS58Prefix(chain)),
      }));
    setFilteredAccounts(filteredAccounts);
  }, [chain, accounts]);

  useEffect(() => {
    onSelect(filteredAccounts[selectedIndex]);
  }, [filteredAccounts, onSelect, selectedIndex]);

  const options = filteredAccounts.map((item, index) => ({
    key: index,
    value: index,
    content: (
      <AccountItem accountName={item.name} accountAddress={item.address} />
    ),
  }));

  return (
    <Wrapper>
      <Label>Account</Label>
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
          accountAddress={filteredAccounts?.[selectedIndex]?.address}
          header
        />
      </DropdownWrapper>
    </Wrapper>
  );
};

export default AccountSelector;
