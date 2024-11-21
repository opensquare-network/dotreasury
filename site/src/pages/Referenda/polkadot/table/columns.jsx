import React from "react";
import SortableIndex from "../../../../components/SortableIndex";
import TextMinor from "../../../../components/TextMinor";
import DescriptionCell from "../../../Proposals/DescriptionCell";
import JumpToLink from "../../Link";
import { useTableColumns } from "../../../../components/shared/useTableColumns";
import TreasurySpendValueDisplay from "../../../../components/treasurySpendValueDisplay";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 112px;
  color: var(--textPrimary);
`;

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

  const amount = {
    key: "amount",
    title: "Value",
    cellClassName: "balance-cell",
    cellRender: (v_, item) => {
      if (item?.allSpends && item?.allSpends.length > 0) {
        return (
          <div>
            {item.allSpends.map((spend, index) => {
              const { amount, isSpendLocal, symbol, assetKind = {} } = spend;

              const displaySymbol = isSpendLocal ? symbol : assetKind?.symbol;

              return (
                <TreasurySpendValueDisplay
                  key={index}
                  isNative={isSpendLocal}
                  value={amount}
                  symbol={displaySymbol}
                />
              );
            })}
          </div>
        );
      }
      return <Wrapper>-</Wrapper>;
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
