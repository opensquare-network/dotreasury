import React from "react";
import SortableIndex from "../../../../components/SortableIndex";
import TextMinor from "../../../../components/TextMinor";
import DescriptionCell from "../../../Proposals/DescriptionCell";
import JumpToLink from "../../Link";
import { useTableColumns } from "../../../../components/shared/useTableColumns";
import ValueDisplay from "../../../../components/ValueDisplay";
import { polkadot } from "../../../../utils/chains/polkadot";

const Columns = ({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  chain,
}) => {
  const { proposeTime, proposer, referendaStatus } = useTableColumns({});

  const index = {
    key: "index",
    title: "Index",
    dataIndex: "referendumIndex",
    cellClassName: "index-cell",
    cellRender: (value) => <TextMinor>#{value}</TextMinor>,
  };

  const description = {
    key: "description",
    title: "Description",
    cellClassName: "opengov-description-cell",
    cellRender: (_, item) => (
      <DescriptionCell
        description={item.title}
        trackInfo={item.onchainData?.trackInfo}
        tally={item.onchainData?.tally}
      />
    ),
  };

  const linkToSubSquare = {
    key: "link-to-subsquare",
    title: "",
    headerCellClassName: "hidden",
    cellClassName: "link-cell hidden",
    cellRender: (_, item) => (
      <JumpToLink
        href={`https://${chain}.subsquare.io/referenda/referendum/${item.referendumIndex}`}
      />
    ),
  };

  // TODO: multi symbols display
  const amount = {
    key: "amount",
    title: "Value",
    cellClassName: "index-cell",
    cellRender: (v_, item) => {
      if (item?.allSpends) {
        const { amount, isSpendLocal, symbol = "" } = item?.allSpends[0];
        const decimals = isSpendLocal ? polkadot.decimals : 0;
        return (
          <ValueDisplay symbol={symbol} value={amount} precision={decimals} />
        );
      }
      return <div>-</div>;
    },
  };

  const sortableProposalIndex = {
    ...index,
    title: (
      <SortableIndex
        direction={sortField === "index" ? sortDirection : ""}
        onClick={() => {
          setSortField("index");
          setSortDirection(
            sortField === "index" && sortDirection === "asc" ? "desc" : "asc",
          );
        }}
      />
    ),
  };

  return [
    sortableProposalIndex,
    proposeTime,
    proposer,
    description,
    amount,
    referendaStatus,
    linkToSubSquare,
  ];
};

export default Columns;
