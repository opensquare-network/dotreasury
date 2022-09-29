import { useParams } from "react-router";
import InfoCard, { InfoCardExtraItem } from "../../../components/InfoCard";
import Avatar from "../../../components/User/Avatar";
import Badge from "../../../components/User/Badge";
import TagOrigin from "../../../components/Tag/Tag";
import { useIdentity } from "../../../utils/hooks";
import { ellipsis } from "../../../utils/ellipsis";
import ProposalsCount from "../../../components/ProposalsCount";
import { useDispatch, useSelector } from "react-redux";
import {
  usersCountsSelector,
  fetchUsersCounts,
  resetUsersCounts,
  countsLoadingSelector,
} from "../../../store/reducers/usersDetailSlice";
import { useEffect, useMemo } from "react";
import {
  chainSelector,
  chainSymbolSelector,
} from "../../../store/reducers/chainSlice";
import { USER_ROLES } from "../../../constants";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { useUserLinks } from "./useUserLinks";

const InfoCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const InfoCardDescriptionAddress = styled.span`
  word-break: break-all;
`;

const Tag = styled(TagOrigin)`
  text-transform: capitalize;
  display: inline-block;
`;

const Link = styled(RouterLink)`
  & + & {
    margin-left: 8px;
  }
`;

const isProposalsRole = (role) =>
  [USER_ROLES.Beneficiary, USER_ROLES.Proposer].includes(role);

export default function UserInfo({ role, setRole = () => {} }) {
  const { address } = useParams();
  const { name, badgeData } = useIdentity(address);
  const dispatch = useDispatch();
  const counts = useSelector(usersCountsSelector);
  const countsLoading = useSelector(countsLoadingSelector);
  const chain = useSelector(chainSelector);
  const chainSymbol = useSelector(chainSymbolSelector).toLowerCase();

  const shouldShowProposals = useMemo(() => isProposalsRole(role), [role]);

  const links = useUserLinks();

  const hasCounts = useMemo(() => {
    return [
      counts?.proposalsCount,
      counts?.bountiesCount,
      counts?.childBountiesCount,
      counts?.tipsCount,
    ].some((n) => n);
  }, [counts]);

  useEffect(() => {
    if (!shouldShowProposals) {
      return;
    }

    dispatch(fetchUsersCounts(chain, address, role?.toLowerCase()));

    return () => {
      dispatch(resetUsersCounts());
    };
  }, [dispatch, chain, role, address, shouldShowProposals]);

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
              <Link
                key={idx}
                to={`/${chainSymbol}/users/${address}/${r}${
                  isProposalsRole(r) ? "/proposals" : ""
                }`}
              >
                <Tag
                  rounded
                  hoverable
                  color={r === role && "pink"}
                  onClick={() => setRole(r)}
                >
                  {r}
                </Tag>
              </Link>
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
