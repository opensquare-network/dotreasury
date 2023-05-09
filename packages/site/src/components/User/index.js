import React from "react";
import styled from "styled-components";

import Username from "./Username";
import Avatar from "./Avatar";
import Badge from "./Badge";
import { useIdentity } from "../../utils/hooks";
import DeletedAccount from "./DeletedAccount";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { makeInSiteUserDetailLink } from "../../utils/url";
import { truncate } from "../../styles/tailwindcss";

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
  const symbol = useSelector(chainSymbolSelector).toLowerCase();

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
      <Link
        style={{ maxWidth: "100%" }}
        to={makeInSiteUserDetailLink(symbol, address, role)}
      >
        {username}
      </Link>
    );
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
