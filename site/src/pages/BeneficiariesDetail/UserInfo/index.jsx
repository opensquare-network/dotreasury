import { useParams } from "react-router";
import InfoCard, { InfoCardExtraItem } from "../../../components/InfoCard";
import Avatar from "../../../components/User/Avatar";
import Badge from "../../../components/User/Badge";
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
import styled from "styled-components";
import { useUserLinks } from "./useUserLinks";
import { useUserTreasurySpendsCount } from "../../../context/userTreasurySpends";
import AwardValue from "./awardValue";

const InfoCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const InfoCardDescriptionAddress = styled.span`
  word-break: break-all;
`;

export default function UserInfo({ role }) {
  const { address } = useParams();
  const { name, badgeData } = useIdentity(address);
  const dispatch = useDispatch();
  const counts = useSelector(usersCountsSelector);
  const countsLoading = useSelector(countsLoadingSelector);
  const spendsCount = useUserTreasurySpendsCount();

  const links = useUserLinks();

  const hasCounts = useMemo(() => {
    return [
      spendsCount,
      counts?.proposalsCount,
      counts?.bountiesCount,
      counts?.childBountiesCount,
      counts?.tipsCount,
    ].some((n) => n);
  }, [counts, spendsCount]);

  useEffect(() => {
    dispatch(fetchUsersCounts(address, role?.toLowerCase()));

    return () => {
      dispatch(resetUsersCounts());
    };
  }, [dispatch, role, address]);

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
          <InfoCardExtraItem label="Award value">
            <AwardValue />
          </InfoCardExtraItem>
          {!countsLoading && (
            <InfoCardExtraItem label="Proposals">
              {hasCounts ? (
                <ProposalsCount
                  spends={spendsCount}
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
