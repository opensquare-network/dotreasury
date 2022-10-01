// page `/:symbol/users/:address`
import { useEffect, useMemo, useState } from "react";
import { USER_ROLES } from "../../constants";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import ProposalsTables from "./ProposalsTables";
import { useEnsureUsersCount } from "./useEnsureUsersCount";
import { useResetTableData } from "./useResetTableData";
import Councilor from "./Councilor";
import { useHistory, useParams } from "react-router";
import { isProposalsRole } from "./utils";
import { makeInSiteUserDetailLink } from "../../utils/url";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

export default function UsersDetail() {
  useEnsureUsersCount();
  useResetTableData();

  const history = useHistory();
  const { address, role: roleParam, tableTab } = useParams();
  const symbol = useSelector(chainSymbolSelector).toLowerCase();

  const [role, setRole] = useState(roleParam || USER_ROLES.Beneficiary);

  useEffect(() => setRole(roleParam), [roleParam]);

  useEffect(() => {
    if (!tableTab && isProposalsRole(roleParam)) {
      history.replace(
        makeInSiteUserDetailLink(symbol, address, roleParam, "proposals")
      );
    }
  }, [roleParam, tableTab, address, history, symbol]);

  const councilorRole = useMemo(() => role === USER_ROLES.Councilor, [role]);
  const proposalsRole = useMemo(
    () => [USER_ROLES.Beneficiary, USER_ROLES.Proposer].includes(role),
    [role]
  );

  return (
    <div>
      <DetailGoBack />

      <UserInfo role={role} setRole={setRole} />

      {councilorRole && <Councilor role={role} />}

      {proposalsRole && <ProposalsTables role={role} />}
    </div>
  );
}
