import React from "react";
import styled from "styled-components";

import Username from "./Username";
import Avatar from "./Avatar";
import Badge from "./Badge";
import { useIdentity } from "../../utils/hooks";
import DeletedAccount from "./DeletedAccount";
import { Link as RouterLink } from "react-router-dom";
import { truncate } from "../../styles/tailwindcss";
import { USER_ROLES } from "../../constants/index.js";
import { useChain } from "../../utils/hooks/chain";
import ExternalLink from "../../components/ExternalLink";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  max-width: inherit;
  ${truncate};
  > :first-child {
    margin-right: 8px;
  }
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  ${truncate};
`;

const Link = styled(RouterLink)`
  max-width: 100%;
  ${truncate};
`;

const User = ({
  address,
  ellipsis = true,
  popup = true,
  popupContent,
  avatarSize = 22,
  noLink = false,
  role = "",
}) => {
  const { name, badgeData } = useIdentity(address);
  const chain = useChain();

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
    if (role === USER_ROLES.Beneficiary) {
      username = <Link to={`/beneficiaries/${address}`}>{username}</Link>;
    } else {
      username = (
        <ExternalLink href={`https://${chain}.subsquare.io/user/${address}`}>
          {username}
        </ExternalLink>
      );
    }
  }

  return (
    <>
      {address ? (
        <Wrapper>
          <Avatar address={address} size={avatarSize} />
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
