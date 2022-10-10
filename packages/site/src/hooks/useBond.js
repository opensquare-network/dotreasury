import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

export default function useBond({ api, proposalValue }) {
  const [bondPercentage, setBondPercentage] = useState();
  const [bondMaximum, setBondMaximum] = useState();
  const [bondMinimum, setBondMinimum] = useState();

  useEffect(() => {
    if (api) {
      setBondPercentage(api.consts.treasury?.proposalBond?.toJSON());
      setBondMaximum(api.consts.treasury?.proposalBondMaximum?.toJSON());
      setBondMinimum(api.consts.treasury?.proposalBondMinimum?.toJSON());
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

  return bond.isNaN() ? new BigNumber(0) : bond;
}
