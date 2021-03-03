import React from "react";
import styled, { css } from "styled-components";

import TextMinor from "./TextMinor";
import UserAvatar from "./User/Avatar";
import Text from "./Text";
import Address from "./Address";

const ItemWrapper = styled.div`
  height: 64px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  & > div:first-child {
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
      <UserAvatar address={accountAddress} size={40} />
      <div>
        <Text>{accountName}</Text>
        <TextMinor>
          <Address>{accountAddress}</Address>
        </TextMinor>
      </div>
    </ItemWrapper>
  );
};

export default AccountItem;
