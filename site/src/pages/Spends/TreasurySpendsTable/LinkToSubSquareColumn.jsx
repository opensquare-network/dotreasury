import { currentChain } from "../../../utils/chains";
import JumpToLink from "../../Referenda/Link";

const subsquareTreasuryLink = `https://${currentChain}.subsquare.io/treasury`;

export const treasurySpendsLinkToSubSquareColumn = {
  key: "link-to-subsquare",
  title: " ",
  headerCellClassName: "",
  cellClassName: "link-cell ",
  cellRender: (_, item) => {
    const type = item?.polkassemblyPostType;

    let href = "";

    if (type === "ReferendumV2") {
      href = `${subsquareTreasuryLink}/spends/${item.index}`;
    } else if (type === "TreasuryProposal") {
      href = `${subsquareTreasuryLink}/proposals/${item.proposalIndex}`;
    } else if (type === "Tip") {
      href = `${subsquareTreasuryLink}/tip/${item.hash}`;
    }

    return <JumpToLink href={href} />;
  },
};
