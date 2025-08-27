import { useParams } from "react-router";
import InfoCard, { InfoCardExtraItem } from "../../../components/InfoCard";
import Avatar from "../../../components/User/Avatar";
import Badge from "../../../components/User/Badge";
import { useIdentity } from "../../../utils/hooks";
import { ellipsis } from "../../../utils/ellipsis";
import ProposalsCount from "../../../components/ProposalsCount";
import { useMemo } from "react";
import styled from "styled-components";
import { useUserLinks } from "./useUserLinks";
import AwardValue from "./awardValue";
import { useUserBeneficiaryProposalsCounts } from "../../../context/userBeneficiaryDetail";

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
  const { counts, loading: countsLoading } =
    useUserBeneficiaryProposalsCounts();
  const links = useUserLinks();

  const hasCounts = useMemo(() => {
    return [
      counts?.spendsCount,
      counts?.proposalsCount,
      counts?.bountiesCount,
      counts?.childBountiesCount,
      counts?.tipsCount,
    ].some((n) => n);
  }, [counts]);

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
                  spends={counts?.spendsCount}
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
