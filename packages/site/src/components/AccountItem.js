import React from "react";
import styled, { css } from "styled-components";

import TextMinor from "./TextMinor";
import UserAvatar from "./User/Avatar";
import Text from "./Text";
import Address from "./Address";
import { encodeKusamaAddress } from "../services/chainApi";

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
  const kusamaAddress = encodeKusamaAddress(accountAddress);
  return (
    <ItemWrapper header={header}>
      <UserAvatar address={kusamaAddress} size={40} />
      <div>
        <Text>{accountName}</Text>
        <TextMinor>
          <Address>{kusamaAddress}</Address>
        </TextMinor>
      </div>
    </ItemWrapper>
  );
};

export default AccountItem;
