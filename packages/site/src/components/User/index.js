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

const User = ({ address, ellipsis = true, popup = true, popupContent }) => {
  const { name, badgeData } = useIdentity(address);

  return (
    <>
      {address ? (
        <Wrapper>
          <Avatar address={address} size={22} />
          <BadgeWrapper>
            <Badge {...badgeData} />
            <ExplorerLink href={`/account/${address}`}>
              <Username
                name={name}
                address={address}
                ellipsis={ellipsis}
                popup={popup}
                popupContent={popupContent}
              />
            </ExplorerLink>
          </BadgeWrapper>
        </Wrapper>
      ) : (
        <DeletedAccount />
      )}
    </>
  );
};

export default React.memo(User);
