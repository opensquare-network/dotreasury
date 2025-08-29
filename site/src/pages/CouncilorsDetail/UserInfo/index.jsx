import { useParams } from "react-router";
import Avatar from "../../../components/User/Avatar";
import Badge from "../../../components/User/Badge";
import { useIdentity } from "../../../utils/hooks";
import { ellipsis } from "../../../utils/ellipsis";
import styled from "styled-components";
import { useUserLinks } from "../../BeneficiariesDetail/UserInfo/useUserLinks";
import InfoCard from "../../../components/InfoCard";
import AwardValue from "./awardValue";

const InfoCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const InfoCardDescriptionAddress = styled.span`
  word-break: break-all;
`;

export default function UserInfo() {
  const { address } = useParams();
  const { name, badgeData } = useIdentity(address);
  const links = useUserLinks();

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
      extra={<AwardValue />}
    />
  );
}
