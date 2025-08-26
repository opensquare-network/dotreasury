import { useEffect, useState } from "react";
import { USER_ROLES } from "../../constants";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import ProposalsTables from "./ProposalsTables";
import { useEnsureUsersCount } from "./useEnsureUsersCount";
import { useResetTableData } from "./useResetTableData";
import { useHistory, useParams } from "react-router";
import { isProposalsRole } from "./utils";
import Grade from "./Councilor/Grade";
import UserTreasurySpendsProvider from "../../context/userTreasurySpends";

// TODO: remove role data
export default function BeneficiariesDetail() {
  useEnsureUsersCount();
  useResetTableData();

  const history = useHistory();
  const { address, role: roleParam, tableTab } = useParams();

  const [role, setRole] = useState(roleParam || USER_ROLES.Beneficiary);

  useEffect(() => setRole(roleParam), [roleParam]);

  useEffect(() => {
    if (!tableTab && isProposalsRole(roleParam)) {
      history.replace(`/beneficiaries/${address}/proposals`);
    }
  }, [roleParam, tableTab, address, history]);

  return (
    <div>
      <DetailGoBack />

      <UserTreasurySpendsProvider address={address}>
        <UserInfo role={role} setRole={setRole} />
        <ProposalsTables role={role} />
      </UserTreasurySpendsProvider>

      <Grade />
    </div>
  );
}
