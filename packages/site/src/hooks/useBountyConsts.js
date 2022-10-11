import { useEffect, useState } from "react";

export default function useBountyConsts(api) {
  const [bountyDepositBase, setBountyDepositBase] = useState();
  const [bountyValueMinimum, setBountyValueMinimum] = useState();
  const [dataDepositPerByte, setDataDepositPerByte] = useState();
  const [maximumReasonLength, setMaximumReasonLength] = useState();

  useEffect(() => {
    if (api) {
      setBountyDepositBase(api.consts?.bounties?.bountyDepositBase?.toJSON());
      setBountyValueMinimum(api.consts?.bounties?.bountyValueMinimum?.toJSON());
      setDataDepositPerByte(api.consts?.bounties?.dataDepositPerByte?.toJSON());
      setMaximumReasonLength(api.consts?.bounties?.maximumReasonLength?.toJSON());
    }
  }, [api]);

  return {
    bountyDepositBase,
    bountyValueMinimum,
    dataDepositPerByte,
    maximumReasonLength,
  };
}
