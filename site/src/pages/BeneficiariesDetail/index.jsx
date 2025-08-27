import { useEffect } from "react";
import { USER_ROLES } from "../../constants";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import ProposalsTables from "./ProposalsTables";
import { useHistory, useParams } from "react-router";
import Grade from "../UsersDetail/Councilor/Grade";
import UserBeneficiaryDetailProvider from "../../context/userBeneficiaryDetail";
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

      <UserBeneficiaryDetailProvider address={address}>
        <UserInfo role={ROLE} />
        <ProposalsTables role={ROLE} />
      </UserBeneficiaryDetailProvider>

      <Grade />
    </div>
  );
}
