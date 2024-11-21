import { currentChain } from "../../../utils/chains";
import JumpToLink from "../../Referenda/Link";

const subsquareTreasuryLink = `https://${currentChain}.subsquare.io/treasury`;

export const treasurySpendsLinkToSubSquareColumn = {
  key: "link-to-subsquare",
  title: "",
  headerCellClassName: "hidden",
  cellClassName: "link-cell hidden",
  cellRender: (_, item) => {
    const type = item?.type;

    let href = "";

    if (type === "treasurySpend") {
      href = `${subsquareTreasuryLink}/spends/${item.index}`;
    } else if (type === "treasuryProposal") {
      href = `${subsquareTreasuryLink}/proposals/${item.proposalIndex}`;
    } else if (type === "tip") {
      href = `${subsquareTreasuryLink}/tip/${item.hash}`;
    }

    return <JumpToLink href={href} />;
  },
};
