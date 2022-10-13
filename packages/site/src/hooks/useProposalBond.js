import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

export default function useProposalBond({ api, proposalValue }) {
  const [bondPercentage, setBondPercentage] = useState();
  const [bondMaximum, setBondMaximum] = useState();
  const [bondMinimum, setBondMinimum] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (api) {
      setBondPercentage(api.consts.treasury?.proposalBond?.toJSON());
      setBondMaximum(api.consts.treasury?.proposalBondMaximum?.toJSON());
      setBondMinimum(api.consts.treasury?.proposalBondMinimum?.toJSON());
      setIsLoading(false)
    }
  }, [api]);

  const value = new BigNumber(proposalValue);
  let bond = value.times(bondPercentage / 1000000);

  if (bondMaximum) {
    bond = BigNumber.min(bond, bondMaximum);
  }

  if (bondMinimum) {
    bond = bond.isNaN()
      ? new BigNumber(bondMinimum)
      : BigNumber.max(bond, bondMinimum);
  }

  const result = bond.isNaN() ? new BigNumber(0) : bond;

  return { bond: result, isLoading };
}
