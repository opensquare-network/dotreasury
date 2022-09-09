import React from "react";
import styled from "styled-components";

import Username from "./Username";
import Avatar from "./Avatar";
import Badge from "./Badge";
import ExplorerLink from "../../components/ExplorerLink";
import { useIdentity } from "../../utils/hooks";
import DeletedAccount from "./DeletedAccount";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  > :first-child {
    margin-right: 8px;
  }
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const User = ({
  address,
  ellipsis = true,
  popup = true,
  popupContent,
  avatar = true,
  avatarSize = 22,
  noLink = false,
}) => {
  const { name, badgeData } = useIdentity(address);

  let username = (
    <Username
      name={name}
      address={address}
      ellipsis={ellipsis}
      popup={popup}
      popupContent={popupContent}
      noLink={noLink}
    />
  );

  if (!noLink) {
    username = (
      <ExplorerLink href={`/account/${address}`}>
        {username}
      </ExplorerLink>
    );
  }

  return (
    <>
      {address ? (
        <Wrapper>
          {avatar && <Avatar address={address} size={avatarSize} />}
          <BadgeWrapper>
            <Badge {...badgeData} />
            {username}
          </BadgeWrapper>
        </Wrapper>
      ) : (
        <DeletedAccount />
      )}
    </>
  );
};

export default React.memo(User);
