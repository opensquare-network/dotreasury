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
  countsLoadingSelector,
} from "../../store/reducers/usersDetailSlice";
import { useEffect, useMemo } from "react";
import { chainSelector } from "../../store/reducers/chainSlice";
import { USER_ROLES } from "../../constants";
import { Image } from "semantic-ui-react";

export default function UserInfo({ role, setRole = () => {} }) {
  const { address } = useParams();
  const { name, badgeData } = useIdentity(address);
  const dispatch = useDispatch();
  const counts = useSelector(countsSelector);
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
    dispatch(fetchUsersCounts(chain, address, role));

    return () => {
      dispatch(resetUsersCounts());
    };
  }, [dispatch, chain, role, address]);

  return (
    <InfoCard
      minHeight={148}
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
            {Object.values(USER_ROLES).map((r) => (
              <Tag
                rounded
                hoverable
                color={r === role && "pink"}
                onClick={() => setRole(r)}
              >
                {r}
              </Tag>
            ))}
          </InfoCardExtraItem>

          {shouldShowProposals && (
            <InfoCardExtraItem label="Proposals">
              {countsLoading ? (
                <Image width={20} height={20} src="/imgs/loading.svg" />
              ) : hasCounts ? (
                <ProposalsCount
                  proposals={counts?.proposalsCount}
                  bounties={counts?.bountiesCount + counts?.childBountiesCount}
                  tips={counts?.tipsCount}
                />
              ) : (
                <span>--</span>
              )}
            </InfoCardExtraItem>
          )}
        </>
      }
    />
  );
}
