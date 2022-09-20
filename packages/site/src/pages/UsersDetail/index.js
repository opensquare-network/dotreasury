// page `/:symbol/users/:address`
import { useMemo, useState } from "react";
import { USER_ROLES } from "../../constants";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import ProposalsTables from "./ProposalsTables";
import { useEnsureUsersCount } from "./useEnsureUsersCount";
import { useResetTableData } from "./useResetTableData";
import Councilor from "./Councilor";
import { useParams } from "react-router";

export default function UsersDetail() {
  useEnsureUsersCount();
  useResetTableData();

  const { role: roleParam } = useParams();

  // FIXME: default should be Councilor or from api
  const [role, setRole] = useState(roleParam || USER_ROLES.Beneficiary);

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
