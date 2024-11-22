import BigNumber from "bignumber.js";
import { polkadotOpenGovReferendumStatusMap } from "../../../../constants";
import useFetchReferendumsList from "./useFetchReferendumsList";

export default function useReferendumsProcess() {
  const { data, isLoading } = useFetchReferendumsList();
  const referendums = data?.items || [];

  let voting = 0;
  let passing = 0;

  if (referendums && referendums.length > 0) {
    referendums.forEach((item) => {
      const { name: state } = item?.state || {};
      const { tally } = item?.onchainData || {};

      if (
        [
          polkadotOpenGovReferendumStatusMap.Confirming,
          polkadotOpenGovReferendumStatusMap.Deciding,
          polkadotOpenGovReferendumStatusMap.Queueing,
          polkadotOpenGovReferendumStatusMap.Submitted,
        ].includes(state)
      ) {
        voting++;

        if (new BigNumber(tally?.ayes).gt(tally?.nays)) {
          passing++;
        }
      }
    });
  }

  return {
    voting,
    passing,
    isLoading,
  };
}
