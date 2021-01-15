import React from "react";
import styled, { css } from "styled-components";

import Username from "./Username";
import Avatar from "./Avatar";
import Badge from "./Badge";
import ExplorerLink from "../../components/ExplorerLink";
import {useIndentity} from "../../utils/hooks";
import { mrgap } from "../../styles";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`${mrgap("8px")}`}
  overflow: hidden;
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`${mrgap("3px")}`}
`

const User = ({ address, ellipsis = true, popup = true }) => {
  const {name, badgeData} = useIndentity(address)
  return (
    <Wrapper>
      <Avatar address={address} />
      <BadgeWrapper>
        <Badge {...badgeData} />
        <ExplorerLink href={`/account/${address}`}>
          <Username name={name} address={address} ellipsis={ellipsis} popup={popup} />
        </ExplorerLink>
      </BadgeWrapper>
    </Wrapper>
  );
};

export default User;
