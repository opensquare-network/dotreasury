import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import Card from "../../components/Card";
import { useTableColumns } from "../../components/shared/useTableColumns";
import SortableIndex from "../../components/SortableIndex";
import SortableValue from "../../components/SortableValue";
import useSort from "../../hooks/useSort";

const CardWrapper = styled(Card)`
  overflow-x: hidden;
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const Wrapper = styled.div`
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow: scroll;

  .proposal-beneficiary-header,
  .proposal-proposer-header {
    cursor: pointer !important;
    color: var(--textSecondary) !important;
  }
`;

export default function ProposalsTable({ data, tab, loading, header, footer }) {
  const history = useHistory();
  const chain = useSelector(chainSelector);
  const [isBeneficiary, setIsBeneficiary] = useState(true);
  const [tableData, setTableData] = useState(data);

  const { sortField, setSortField, sortDirection, setSortDirection } =
    useSort();

  useEffect(() => {
    setTableData(data);
  }, [data, chain]);

  const getExternalLink = (row) => {
    return `https://${chain}.subsquare.io/treasury/proposal/${row.proposalIndex}`;
  };

  const onRowClick = (row) => {
    if (window.innerWidth < 1140) {
      history.push(getExternalLink(row));
    }
  };

  const getRelatedLinks = (item) => {
    const links = [...item.links];
    links.unshift({
      link: getExternalLink(item),
      description: "Treasury proposal page",
    });
    return links;
  };

  let {
    proposalIndex,
    proposeTime,
    beneficiary,
    proposer,
    description,
    relatedLinks,
    failedReason,
    value,
    proposalStatus,
    externalLink,
  } = useTableColumns({
    getRelatedLinks,
    getExternalLink,
  });

  const handleSwitchBebeficiaryProposer = () =>
    setIsBeneficiary(!isBeneficiary);
  beneficiary = {
    ...beneficiary,
    title: (
      <span style={{ color: "var(--pink500)" }} role="button">
        Beneficiary
      </span>
    ),
    headerCellProps: {
      onClick: handleSwitchBebeficiaryProposer,
    },
  };
  proposer = {
    ...proposer,
    title: (
      <span style={{ color: "var(--pink500)" }} role="button">
        Proposer
      </span>
    ),
    headerCellProps: {
      onClick: handleSwitchBebeficiaryProposer,
    },
  };
  beneficiary = {
    ...beneficiary,
    show: isBeneficiary,
  };
  proposer = {
    ...proposer,
    show: !isBeneficiary,
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
    ...proposalIndex,
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

  let columns;

  if (tab === "failed") {
    columns = [
      sortableProposalIndex,
      proposeTime,
      beneficiary,
      proposer,
      description,
      failedReason,
      sortByValue,
      proposalStatus,
      externalLink,
    ];
  } else {
    columns = [
      sortableProposalIndex,
      proposeTime,
      beneficiary,
      proposer,
      description,
      relatedLinks,
      sortByValue,
      proposalStatus,
      externalLink,
    ];
  }

  return (
    <CardWrapper>
      {header}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <Table columns={columns} data={tableData} onRowClick={onRowClick} />
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
}
