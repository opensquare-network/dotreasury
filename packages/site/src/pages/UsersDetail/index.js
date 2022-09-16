// page `/:symbol/users/:address`
import { useMemo, useState } from "react";
import { USER_ROLES } from "../../constants";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import ProposalsTable from "./ProposalsTable";
import { useEnsureUsersCount } from "./useEnsureUsersCount";

export default function UsersDetail() {
  useEnsureUsersCount();

  // FIXME: default should be Councilor or from api
  const [role, setRole] = useState(USER_ROLES.Beneficiary);

  const proposalsRole = useMemo(
    () => [USER_ROLES.Beneficiary, USER_ROLES.Proposer].includes(role),
    [role]
  );

  return (
    <div>
      <DetailGoBack />

      <UserInfo role={role} setRole={setRole} />

      {proposalsRole && <ProposalsTable role={role} />}
    </div>
  );
}
