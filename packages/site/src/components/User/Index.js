import React, {useState, useEffect} from "react";
import styled from "styled-components";

import Username from "./Username";
import Avatar from "./Avatar";
import Badge from "./Badge";
import ExplorerLink from "../../components/ExplorerLink";
import {getIndentity} from "../../services/chainApi";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  overflow: hidden;
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`

const User = ({ address, ellipsis = true, popup = true }) => {
  const [name, setName] = useState(null)
  const [badgeData, setBadgeData] = useState(null)
  useEffect(() => {
    const fetchIdentity = async () => {
      const identity = await getIndentity(address);
      if (identity && identity.display) {
        setName(identity.displayParent ? `${identity.displayParent}/${identity.display}` : identity.display)
        setBadgeData({
          isNull: false,
          hasParent: !!identity.displayParent,
          isJuge: identity.judgements?.length > 0
        })
      } else {
        setName(null)
        setBadgeData(null)
      }
    }
    setName(null)
    setBadgeData(null)
    fetchIdentity()
  }, [address])
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
