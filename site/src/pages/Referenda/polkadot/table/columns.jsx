import React from "react";
import SortableValue from "../../../../components/SortableValue";
import SortableIndex from "../../../../components/SortableIndex";
import TextMinor from "../../../../components/TextMinor";
import DescriptionCell from "../../../Proposals/DescriptionCell";
import JumpToLink from "../../Link";
import { useTableColumns } from "../../../../components/shared/useTableColumns";

const Columns = ({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  chain,
}) => {
  const { proposeTime, proposer, value, referendaStatus } = useTableColumns({});

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

  const sortByValue = {
    ...value,
    title: (
      <SortableValue
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
    ),
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
    sortByValue,
    referendaStatus,
    linkToSubSquare,
  ];
};

export default Columns;
