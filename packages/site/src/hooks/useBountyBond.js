import { useEffect, useState } from "react";
import { calculateBountyBond } from "../utils/bountyHelper";
import useBountyConsts from "./useBountyConsts";

export default function useBountyBond(api, title) {
  const {
    bountyDepositBase,
    dataDepositPerByte,
  } = useBountyConsts(api);
  const [bond, setBond] = useState(bountyDepositBase || 0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bountyDepositBase || !dataDepositPerByte) {
      return;
    }
    setBond(calculateBountyBond(title, bountyDepositBase, dataDepositPerByte));
    setIsLoading(false);
  }, [title, bountyDepositBase, dataDepositPerByte]);

  return { bond, isLoading };
}
