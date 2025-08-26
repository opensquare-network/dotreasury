import { useEffect } from "react";
import { USER_ROLES } from "../../constants";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import ProposalsTables from "./ProposalsTables";
import { useHistory, useParams } from "react-router";
import Grade from "./Councilor/Grade";
import UserTreasurySpendsProvider from "../../context/userTreasurySpends";

export default function BeneficiariesDetail() {
  const ROLE = USER_ROLES.Beneficiary;

  const history = useHistory();
  const { address, tableTab } = useParams();

  useEffect(() => {
    if (!tableTab) {
      history.replace(`/beneficiaries/${address}/proposals`);
    }
  }, [tableTab, address, history]);

  return (
    <div>
      <DetailGoBack />

      <UserTreasurySpendsProvider address={address}>
        <UserInfo role={ROLE} />
        <ProposalsTables role={ROLE} />
      </UserTreasurySpendsProvider>

      <Grade />
    </div>
  );
}
