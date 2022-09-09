import { useParams } from "react-router";
import InfoCard, { InfoCardExtraItem } from "../../components/InfoCard";
import Avatar from "../../components/User/Avatar";
import Badge from "../../components/User/Badge";
import Tag from "../../components/Tag/Tag";
import { useIdentity } from "../../utils/hooks";
import { ellipsis } from "../../utils/ellipsis";

export default function UserInfo({ role, setRole = () => {} }) {
  const { address } = useParams();
  const { name, badgeData } = useIdentity(address);

  return (
    <InfoCard
      title={
        <>
          {badgeData && <Badge {...badgeData} />}
          {name ?? ellipsis(address)}
        </>
      }
      icon={<Avatar address={address} size={64} />}
      description={address}
      extra={
        <>
          <InfoCardExtraItem label="Select a role">
            <Tag rounded>Beneficiary</Tag>
            <Tag rounded>Proposer</Tag>
          </InfoCardExtraItem>
        </>
      }
    />
  );
}
