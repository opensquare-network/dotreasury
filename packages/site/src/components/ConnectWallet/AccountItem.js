import React from "react";
import styled, { css } from "styled-components";
import UserAvatar from "../User/Avatar";
import Address from "../Address";

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

const Name = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
`;

const Addr = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--textTertiary);
`;

const AccountItem = ({ header, accountName, accountAddress }) => {
  return (
    <ItemWrapper header={header}>
      <UserAvatar address={accountAddress} size={40} />
      <div>
        <Name>{accountName}</Name>
        <Addr>
          <Address>{accountAddress}</Address>
        </Addr>
      </div>
    </ItemWrapper>
  );
};

export default AccountItem;
