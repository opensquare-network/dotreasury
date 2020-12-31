import React from "react";
import styled from "styled-components";

import Username from "./Username";
import Avatar from "./Avatar";
import Badge from "./Badge";
import ExplorerLink from "../../components/ExplorerLink";
import {useIndentity} from "../../utils/hooks";

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
  // const [name, setName] = useState(null)
  // const [badgeData, setBadgeData] = useState(null)
  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchIdentity = async () => {
  //     console.log("start fetch identity")
  //     const identity = await getIndentity(address);
  //     if (isMounted && identity && identity.display) {
  //       setName(identity.displayParent ? `${identity.displayParent}/${identity.display}` : identity.display)
  //       setBadgeData({
  //         isDisplay: !!identity.display,
  //         hasParent: !!identity.displayParent,
  //         hasJudgement: identity.judgements?.length > 0
  //       })
  //     }
  //   }
  //   setName(null)
  //   setBadgeData(null)
  //   fetchIdentity()
  //   return () => {
  //     isMounted = false;
  //   }
  // }, [address])
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
