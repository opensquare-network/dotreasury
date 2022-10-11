import { useEffect, useState } from "react";
import { calculateBountyBond } from "../utils/bountyHelper";
import useBountyConsts from "./useBountyConsts";

export default function useBountyBond(api, title) {
  const {
    bountyDepositBase,
    dataDepositPerByte,
  } = useBountyConsts(api);
  const [bond, setBond] = useState(bountyDepositBase || 0);

  useEffect(() => {
    if (!bountyDepositBase || !dataDepositPerByte) {
      return;
    }
    setBond(calculateBountyBond(title, bountyDepositBase, dataDepositPerByte));
  }, [title, bountyDepositBase, dataDepositPerByte]);

  return bond;
}
