import { TimelineItemType } from "../../constants";

export const makeLinkUrl = (chain, data) => {
  if (data?.type === TimelineItemType.CouncilMotion) {
    return `https://${chain}.subsquare.io/council/motion/${data.motionIndex}`;
  } else if (data?.type === TimelineItemType.DemocracyReferendum) {
    return `https://${chain}.subsquare.io/democracy/referendum/${data.referendumIndex}`;
  } else if (data?.type === TimelineItemType.Gov2Referendum) {
    return `https://${chain}.subsquare.io/referenda/referendum/${data.gov2Referendum}`;
  }
};
