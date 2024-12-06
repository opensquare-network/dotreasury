import BigNumber from "bignumber.js";
import { openGovReferendumStatusMap } from "../../../constants";
import { usePolkadotApplicationsData } from "../../../context/PolkadotApplications";

export default function useReferendumsProcess() {
  const { data, isLoading } = usePolkadotApplicationsData();
  const referendums = data?.items || [];

  let voting = 0;
  let passing = 0;

  if (referendums && referendums.length > 0) {
    referendums.forEach((item) => {
      const { name: state } = item?.state || {};
      const { tally } = item?.onchainData || {};

      if (
        [
          openGovReferendumStatusMap.Confirming,
          openGovReferendumStatusMap.Deciding,
          openGovReferendumStatusMap.Queueing,
          openGovReferendumStatusMap.Submitted,
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
