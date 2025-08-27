import { useUserBeneficiaryAwardValue } from "../../../context/userBeneficiaryDetail";
import ValueDisplay from "../../../components/ValueDisplay";

export default function AwardValue() {
  const { value, loading } = useUserBeneficiaryAwardValue();

  if (loading) {
    return null;
  }

  return <ValueDisplay value={value} prefix="$" abbreviate={false} />;
}
