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

const InfoCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default function UserInfo({ role, setRole = () => {} }) {
  const { address } = useParams();
  const { name, badgeData } = useIdentity(address);
  const dispatch = useDispatch();
  const counts = useSelector(usersCountsSelector);
  const countsLoading = useSelector(countsLoadingSelector);
  const chain = useSelector(chainSelector);

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
      description={address}
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
                  bounties={counts?.bountiesCount + counts?.childBountiesCount}
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
