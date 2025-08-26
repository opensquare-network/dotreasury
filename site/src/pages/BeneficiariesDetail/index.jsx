import { useEffect } from "react";
import { USER_ROLES } from "../../constants";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import ProposalsTables from "./ProposalsTables";
import { useHistory, useParams } from "react-router";
import Grade from "../UsersDetail/Councilor/Grade";
import UserTreasurySpendsProvider from "../../context/userTreasurySpends";
import useEnsureBenificiariesCount from "./useEnsureBenificiariesCount";

export default function BeneficiariesDetail() {
  const ROLE = USER_ROLES.Beneficiary;
  useEnsureBenificiariesCount();

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
