import { useEffect, useState } from "react";

export default function useChildBountyConsts(api) {
  const [childBountyValueMinimum, setChildBountyValueMinimum] = useState();
  const [maximumReasonLength, setMaximumReasonLength] = useState();

  useEffect(() => {
    if (api) {
      setChildBountyValueMinimum(api.consts?.childBounties?.childBountyValueMinimum?.toJSON());
      setMaximumReasonLength(api.consts?.bounties?.maximumReasonLength?.toJSON());
    }
  }, [api]);

  return {
    childBountyValueMinimum,
    maximumReasonLength,
  };
}
