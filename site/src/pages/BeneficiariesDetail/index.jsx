import { useEffect } from "react";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import ProposalsTables from "./ProposalsTables";
import { useHistory, useParams } from "react-router";
import Grade from "../UsersDetail/Councilor/Grade";
import UserBeneficiaryDetailProvider from "../../context/userBeneficiaryDetail";
import useEnsureBenificiariesCount from "./useEnsureBenificiariesCount";

export default function BeneficiariesDetail() {
  useEnsureBenificiariesCount();

  const history = useHistory();
  const { address, tableTab } = useParams();

  useEffect(() => {
    if (!tableTab) {
      history.replace(`/beneficiaries/${address}/spends`);
    }
  }, [tableTab, address, history]);

  return (
    <div>
      <DetailGoBack backTo="/beneficiaries" />

      <UserBeneficiaryDetailProvider address={address}>
        <UserInfo />
        <ProposalsTables />
      </UserBeneficiaryDetailProvider>

      <Grade />
    </div>
  );
}
