import React, { useMemo } from "react";
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
import { currentChainSettings } from "../../utils/chains";

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

  const linkedUsername = useMemo(() => {
    const username = (
      <Username
        name={name}
        address={address}
        ellipsis={ellipsis}
        popup={popup}
        popupContent={popupContent}
        noLink={noLink}
      />
    );

    if (noLink) return username;

    if (!currentChainSettings?.usersMigration) {
      return <Link to={`/users/${address}/${role}`}>{username}</Link>;
    }

    if (role === USER_ROLES.Beneficiary) {
      return <Link to={`/beneficiaries/${address}`}>{username}</Link>;
    }

    return (
      <ExternalLink href={`https://${chain}.subsquare.io/user/${address}`}>
        {username}
      </ExternalLink>
    );
  }, [name, address, ellipsis, popup, popupContent, noLink, role, chain]);

  return (
    <>
      {address ? (
        <Wrapper>
          <Avatar address={address} size={avatarSize} />
          <BadgeWrapper>
            <Badge {...badgeData} />
            {linkedUsername}
          </BadgeWrapper>
        </Wrapper>
      ) : (
        <DeletedAccount />
      )}
    </>
  );
};

export default React.memo(User);
