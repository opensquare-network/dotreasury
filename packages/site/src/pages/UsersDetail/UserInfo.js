import { useParams } from "react-router";
import InfoCard, { InfoCardExtraItem } from "../../components/InfoCard";
import Avatar from "../../components/User/Avatar";
import Badge from "../../components/User/Badge";
import Tag from "../../components/Tag/Tag";
import { useIdentity } from "../../utils/hooks";
import { ellipsis } from "../../utils/ellipsis";
import ProposalsCount from "../../components/ProposalsCount";
import { useDispatch, useSelector } from "react-redux";
import {
  usersCountsSelector,
  fetchUsersCounts,
  resetUsersCounts,
  countsLoadingSelector,
} from "../../store/reducers/usersDetailSlice";
import { useEffect, useMemo } from "react";
import { chainSelector } from "../../store/reducers/chainSlice";
import { USER_ROLES } from "../../constants";
import styled from "styled-components";
import { useState } from "react";

const InfoCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const InfoCardDescriptionAddress = styled.span`
  word-break: break-all;
`;

function createLinks(chain, address, otherLinks = []) {
  const links = [];

  otherLinks.forEach(item => links.push(item));

  links.push({
    link: `https://${chain}.subsquare.io/user/${address}`,
  });

  links.push({
    link: `https://${chain}.subscan.io/account/${address}`,
  });

  return links;
}

export default function UserInfo({ role, setRole = () => {} }) {
  const { address } = useParams();
  const { name, badgeData } = useIdentity(address);
  const dispatch = useDispatch();
  const counts = useSelector(usersCountsSelector);
  const countsLoading = useSelector(countsLoadingSelector);
  const chain = useSelector(chainSelector);
  const [links, setLinks] = useState(createLinks(chain, address));

  const shouldShowProposals = useMemo(
    () => [USER_ROLES.Beneficiary, USER_ROLES.Proposer].includes(role),
    [role]
  );
  const hasCounts = useMemo(() => {
    return [
      counts?.proposalsCount,
      counts?.bountiesCount,
      counts?.childBountiesCount,
      counts?.tipsCount,
    ].some((n) => n);
  }, [counts]);

  useEffect(() => {
    dispatch(fetchUsersCounts(chain, address, role?.toLowerCase()));

    return () => {
      dispatch(resetUsersCounts());
    };
  }, [dispatch, chain, role, address]);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_IDENTITY_SERVER_HOST}/${chain}/identity/${address}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => resp.json())
    .then((data) => {
      const links = [];

      const info = data?.info;
      if (info?.email) {
        links.push({
          link: `mailto:${info.email}`,
        });
      }
      if (info?.riot) {
        links.push({
          link: `https://matrix.to/#/${info.riot}`,
        });
      }
      if (info?.twitter) {
        links.push({
          link: `https://www.twitter.com/${info.twitter}`,
        });
      }
      if (info?.web) {
        links.push({
          link: info.web,
        });
      }

      setLinks(createLinks(chain, address, links));
    });
  }, [chain, address]);

  return (
    <InfoCard
      minHeight={148}
      title={
        <InfoCardTitleWrapper>
          {badgeData && <Badge {...badgeData} />}
          {name ?? ellipsis(address)}
        </InfoCardTitleWrapper>
      }
      icon={<Avatar address={address} size={64} />}
      description={
        <InfoCardDescriptionAddress>{address}</InfoCardDescriptionAddress>
      }
      links={links}
      extra={
        <>
          <InfoCardExtraItem label="Select a role">
            {Object.values(USER_ROLES).map((r, idx) => (
              <Tag
                key={idx}
                rounded
                hoverable
                color={r === role && "pink"}
                onClick={() => setRole(r)}
              >
                {r}
              </Tag>
            ))}
          </InfoCardExtraItem>

          {shouldShowProposals && !countsLoading && (
            <InfoCardExtraItem label="Proposals">
              {hasCounts ? (
                <ProposalsCount
                  proposals={counts?.proposalsCount}
                  bounties={counts?.bountiesCount}
                  childBounties={counts?.childBountiesCount}
                  tips={counts?.tipsCount}
                />
              ) : (
                <span>0</span>
              )}
            </InfoCardExtraItem>
          )}
        </>
      }
    />
  );
}
