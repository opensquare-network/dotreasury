import ValueDisplay from "../../../components/ValueDisplay";
import { InfoCardExtraItem } from "../../../components/InfoCard";
import useCouncilorDetail from "../../../hooks/useCouncilorDetail";
import { useParams } from "react-router";

export default function AwardValue() {
  const { address } = useParams();
  const { data, loading } = useCouncilorDetail(address);
  if (loading) {
    return null;
  }

  return (
    <InfoCardExtraItem label="Award value">
      <ValueDisplay
        value={data?.totalFiatValue?.totalBenefit || 0}
        prefix="$"
        abbreviate={false}
      />
    </InfoCardExtraItem>
  );
}
