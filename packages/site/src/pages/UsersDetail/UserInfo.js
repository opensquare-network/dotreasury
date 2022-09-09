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
  countsSelector,
  fetchUsersCounts,
  resetUsersCounts,
} from "../../store/reducers/usersDetailSlice";
import { useEffect } from "react";
import { chainSelector } from "../../store/reducers/chainSlice";

export default function UserInfo({ role, setRole = () => {} }) {
  const { address } = useParams();
  const { name, badgeData } = useIdentity(address);
  const dispatch = useDispatch();
  const counts = useSelector(countsSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchUsersCounts(chain, address, role));

    return () => dispatch(resetUsersCounts());
  }, [dispatch, role, address]);

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

          {/* FIXME: condition to display counts */}
          {role === "beneficiary" && (
            <InfoCardExtraItem label="Proposals">
              <ProposalsCount
                proposals={counts?.proposalsCount}
                bounties={counts?.bountiesCount + counts?.childBountiesCount}
                tips={counts?.tipsCount}
              />
            </InfoCardExtraItem>
          )}
        </>
      }
    />
  );
}
