import useBeneficiaryDetail from "../../../hooks/useBeneficiaryDetail";
import { useParams } from "react-router";
import ValueDisplay from "../../../components/ValueDisplay";

// TODO: data context for detail tab & AwardValue
export default function AwardValue() {
  const { address } = useParams();
  const { data } = useBeneficiaryDetail(address);

  return (
    <ValueDisplay
      value={data?.totalBenefitFiatValue || 0}
      prefix="$"
      abbreviate={false}
    />
  );
}
